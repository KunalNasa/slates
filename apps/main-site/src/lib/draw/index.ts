import axios from "axios";
import { BACKEND_URL } from "../../configs/ServerUrls";
import { Dispatch, SetStateAction } from "react";

/* TODO: 
    Redefine shapes type for ellipse and add logic to erase.
    Fix this class logic to follow DRY and break it into components (Requires changing BE routes);
    Use Switch case. It is cleaner (Done)
*/
export type Tool = "circle" | "rect" | "line" | "pencil" | "pan"  | "rhombus";
export type PencilPoints = {
    x : number, y : number
}
let pencilTrace : Array<PencilPoints> = [];
type Shape = {
    type : "rect",
    x : number,
    y : number,
    width : number,
    height : number 
} | {
    type : "circle",
    centerX : number,
    centerY : number,
    radiusX : number,
    radiusY : number
} | {
    type : "line",
    startX : number,
    startY : number,
    endX : number,
    endY : number
} | {
    type : "pencil",
    points : PencilPoints[]
} | {
    type : 'pan'
}

export class Game {
    // canvas is your board and ctx is like pencil to it. You tell your pencil about tasks it need to do.
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private existingShapes : Shape[];
    private roomId : string;
    private startX : number;
    private startY : number;
    private clicked : boolean;
    private offsetX : number = 0;
    private offsetY : number = 0;
    public scale : number = 1;
    private selectedTool : Tool = "pan";
    public setScale : Dispatch<SetStateAction<number>>;
    private ws: WebSocket
    constructor(canvas : HTMLCanvasElement, roomId : string, ws : WebSocket, setScale: Dispatch<SetStateAction<number>> ){
        this.canvas = canvas;
        this.setScale = setScale;
        this.ctx = canvas.getContext("2d")!;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.roomId = roomId;
        this.startX = 0;
        this.startY = 0;
        this.existingShapes = [];
        this.clicked = false;
        this.ctx.lineWidth = 1.2

        this.ws = ws;
        this.init();
        this.initHandler();
        this.initMouseHandler();
    }

    

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("wheel", this.mouseWheelHandler);
        
    }
    setTool(tool : Tool){
        console.log("This tool: ",this.selectedTool);
        this.selectedTool = tool;
    }

    async init(){    
        
       try {
         const getShapes = await axios.get(`${BACKEND_URL}/user/chats/${this.roomId}`, {
            withCredentials : true
         });
         const data = getShapes.data.data;
         data.forEach((element : any) => {
            this.existingShapes.push(JSON.parse(element.message));
         });
         console.log(this.existingShapes);
        //  this.existingShapes = getShapes.data.data.message;
         this.clearCanvas();
       } catch (error : any) {
            console.log(error);
       }
    }
    initHandler() {
        this.ws.onmessage = (event) => {
            /* 
            event.data : {
                type : "chat" | "join_room" | "leave_room",
                message : {
                    type : "rect" | "circle" | "line"
                    otherData.....
                },
                .....
            }
            */
           console.log(event);
            const message = JSON.parse(event.data);
            if(message.type === "chat"){
                const parsedData = JSON.parse(message.message);
                // console.log('Parse Data to add:', parsedData);
                this.existingShapes.push(parsedData);
                this.clearCanvas();
            }
        }
    }

    initMouseHandler() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("wheel", this.mouseWheelHandler);
    }
    mouseWheelHandler = (e : any) => {
        e.preventDefault();
        const zoomFactor = 1.04;
        const mouseX = (e.clientX - this.offsetX)/this.scale;
        const mouseY = (e.clientY - this.offsetY)/this.scale;
  
        const minScale = 0.2;  // Minimum zoom level
        const maxScale = 5;    // Maximum zoom level

        if (e.deltaY < 0) {
            this.scale = Math.min(this.scale * zoomFactor, maxScale);  // Zoom in
        } else {
            this.scale = Math.max(this.scale / zoomFactor, minScale);  // Zoom out
        }
        this.setScale(Math.floor((this.scale)*100));
        // Adjust offsets to keep zoom centered at cursor
        this.offsetX = e.clientX - mouseX * this.scale;
        this.offsetY = e.clientY - mouseY * this.scale;
        this.clearCanvas();

    }
    mouseDownHandler = (e : any) => {
        this.clicked = true;
        if(this.selectedTool === "pan"){
            this.startX = e.clientX - this.offsetX;
            this.startY = e.clientY - this.offsetY;
            this.canvas.style.cursor = "grabbing";
        }else if(this.selectedTool === 'pencil'){
            this.ctx.beginPath();
        }else{
            this.startX = (e.clientX - this.offsetX) / this.scale;
            this.startY = (e.clientY - this.offsetY) / this.scale;
        }
    }


    mouseUpHandler = (e : any) => {
        this.clicked = false;
        this.canvas.style.cursor = "default";
        const worldX = ((e.clientX - this.offsetX) / this.scale);
        const worldY = ((e.clientY - this.offsetY) / this.scale);

        let shape : Shape | null = null;
        if(this.selectedTool === "rect"){
            shape = {
                type : "rect",
                x : this.startX,
                y : this.startY,
                width : worldX - this.startX,
                height : worldY - this.startY
            }
        }else if(this.selectedTool === "circle"){            
            // Calculate horizontal and vertical radii
            const rx = Math.abs(worldX - this.startX); 
            const ry = Math.abs(worldY - this.startY);
            
            shape = {
                type : "circle",
                centerX : this.startX,
                centerY : this.startY,
                radiusX : rx,
                radiusY : ry,
            }
        }
        else if(this.selectedTool === "line"){
            shape = {
                type : "line",
                startX : this.startX,
                startY : this.startY,
                endX : worldX,
                endY : worldY
            }

        }else if(this.selectedTool === "pencil"){
            this.ctx.closePath();
            shape = {
                type : "pencil",
                points : pencilTrace
            }
            pencilTrace = [];
        }else if(this.selectedTool === "pan"){
            this.canvas.style.cursor = "default";
            this.clicked = false;
            this.setTool("pan");
        }
        // console.log(shape);
        if(!shape){
            return;
        }
        this.existingShapes.push(shape);
        // console.log(JSON.stringify(shape));
        this.ws.send(JSON.stringify({
            type : "chat",
            message : JSON.stringify(shape),
            roomId : Number(this.roomId)
        }))
    }
    mouseMoveHandler = (e : any) => {
        if(this.clicked){
            const worldX = (e.clientX - this.offsetX) / this.scale;
            const worldY = (e.clientY - this.offsetY) / this.scale;
            if (this.selectedTool !== 'pencil') {
                // for pencil we don't want to clear paths
                this.clearCanvas();
            }
            this.ctx.strokeStyle = "white";
            const selectedTool = this.selectedTool;

            switch (selectedTool) {
                case "rect":
                    this.ctx.strokeRect(this.startX, this.startY, worldX - this.startX, worldY - this.startY);
                    break;

                case "circle":
                    const rx = Math.abs(worldX - this.startX);
                    const ry = Math.abs(worldY - this.startY);

                    this.ctx.beginPath();
                    this.ctx.ellipse(this.startX, this.startY, rx, ry, 0, 0, 2 * Math.PI);
                    this.ctx.stroke();
                    this.ctx.closePath();
                    break;

                case "line":
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.startX, this.startY);
                    this.ctx.lineTo(worldX, worldY);
                    this.ctx.stroke();
                    this.ctx.closePath();
                    break;

                case "pencil":
                    this.ctx.lineTo(worldX, worldY);
                    this.ctx.stroke();
                    this.startX = worldX;
                    this.startY = worldY;
                    pencilTrace.push({ x: worldX, y: worldY });
                    break;

                case "pan":
                    this.offsetX = e.clientX - this.startX;
                    this.offsetY = e.clientY - this.startY;
                    break;

                default:
                    break;
            }
        }
    }

    redrawShapes() {
        this.ctx.strokeStyle = "white";
    
        this.existingShapes.forEach((shape) => {
            switch (shape.type) {
                case "rect":
                    this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                    break;
                case "circle":
                    this.ctx.beginPath();
                    this.ctx.ellipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY, 0, 0, 2 * Math.PI);
                    this.ctx.stroke();
                    this.ctx.closePath();
                    break;
                case "line":
                    this.ctx.beginPath();
                    this.ctx.moveTo(shape.startX, shape.startY);
                    this.ctx.lineTo(shape.endX, shape.endY);
                    this.ctx.stroke();
                    this.ctx.closePath();
                    break;
                case "pencil":
                    if (!shape.points) {
                        return;
                    }
                    this.ctx.beginPath();
                    shape.points.forEach(({ x, y }) => {
                        this.ctx.lineTo(x, y);
                        this.ctx.stroke();
                    });
                    this.ctx.closePath();
                    break;
                default:
                    break;
            }
        });
    }
    
    clearCanvas() {
        // Set transformations
        this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
        this.ctx.clearRect(-this.offsetX/this.scale, -this.offsetY/this.scale, this.canvas.width/this.scale, this.canvas.height/this.scale);

    
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.redrawShapes();
    }
    
}