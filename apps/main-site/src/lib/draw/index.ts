import axios from "axios";
import { BACKEND_URL } from "../../configs/ServerUrls";

export type Tool = "circle" | "rect" | "line" | "pencil" | "pan" | "ellipse" | "rhombus";
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
    radius : number
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
    private scale : number = 1;
    private selectedTool : Tool = "pan";
    private ws: WebSocket
    constructor(canvas : HTMLCanvasElement, roomId : string, ws : WebSocket){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.roomId = roomId;
        this.startX = 0;
        this.startY = 0;
        this.existingShapes = [];
        this.clicked = false;

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
  
        const minScale = 0.1;  // Minimum zoom level
        const maxScale = 5;    // Maximum zoom level

        if (e.deltaY < 0) {
            this.scale = Math.min(this.scale * zoomFactor, maxScale);  // Zoom in
        } else {
            this.scale = Math.max(this.scale / zoomFactor, minScale);  // Zoom out
        }

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
            // this.ctx.moveTo((e.clientX - this.offsetX) / this.scale, (e.clientY - this.offsetY) / this.scale);
        }else{
            this.startX = (e.clientX - this.offsetX) / this.scale;
            this.startY = (e.clientY - this.offsetY) / this.scale;
        }
    }


    mouseUpHandler = (e : any) => {
        this.clicked = false;
        this.canvas.style.cursor = "default";
        // const width = e.clientX - this.startX;
        // const height = e.clientY - this.startY;
        let worldX = ((e.clientX - this.offsetX) / this.scale) - this.startX;
        let worldY = ((e.clientY - this.offsetY) / this.scale) - this.startY;

        let shape : Shape | null = null;
        if(this.selectedTool === "rect"){
            shape = {
                type : "rect",
                x : this.startX,
                y : this.startY,
                width : worldX,
                height : worldY
            }
        }else if(this.selectedTool === "circle"){
            worldX = (e.clientX - this.offsetX) / this.scale;
            worldY = (e.clientY - this.offsetY) / this.scale;
            const radius = Math.sqrt((worldX - this.startX) ** 2 + (worldY - this.startY) ** 2);
            shape = {
                type : "circle",
                centerX : this.startX,
                centerY : this.startY,
                radius : radius
            }
        }else if (this.selectedTool === "ellipse") {
            
        }else if(this.selectedTool === "line"){
            worldX = (e.clientX - this.offsetX) / this.scale;
            worldY = (e.clientY - this.offsetY) / this.scale;
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
            // const width = e.clientX - this.startX;
            // const height = e.clientY - this.startY;
            if(this.selectedTool !== 'pencil'){
                // for pencil we dont want to clear paths
                this.clearCanvas();
            }
            this.ctx.strokeStyle = "white"
            const selectedTool = this.selectedTool;
            if(selectedTool === "rect"){
                this.ctx.strokeRect(this.startX, this.startY, ((e.clientX - this.offsetX) / this.scale) - this.startX, ((e.clientY - this.offsetY) / this.scale) - this.startY);
            }else if(selectedTool === "circle"){
                const worldX = (e.clientX - this.offsetX) / this.scale;
                const worldY = (e.clientY - this.offsetY) / this.scale;
                
                // Calculate radius using distance formula
                const radius = Math.sqrt((worldX - this.startX) ** 2 + (worldY - this.startY) ** 2);

                this.ctx.beginPath();
                this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            }else if(selectedTool === "ellipse"){
                const worldX = (e.clientX - this.offsetX) / this.scale;
                const worldY = (e.clientY - this.offsetY) / this.scale;
            
                // Calculate horizontal and vertical radii
                const rx = Math.abs(worldX - this.startX); 
                const ry = Math.abs(worldY - this.startY);
            
                this.ctx.beginPath();
                this.ctx.ellipse(this.startX, this.startY, rx, ry, 0, 0, 2 * Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            }else if(selectedTool === "line"){
                this.ctx.beginPath();
                // const rect = this.canvas.getBoundingClientRect();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo((e.clientX - this.offsetX) / this.scale, (e.clientY - this.offsetY) / this.scale);
                this.ctx.stroke();  
                this.ctx.closePath();
            }else if(selectedTool === "pencil"){
                this.ctx.lineTo((e.clientX - this.offsetX) / this.scale, (e.clientY - this.offsetY) / this.scale);
                this.ctx.stroke();  
                this.startX = (e.clientX - this.offsetX) / this.scale;
                this.startY = (e.clientY - this.offsetY) / this.scale;
                pencilTrace.push({x : (e.clientX - this.offsetX) / this.scale, y: (e.clientY - this.offsetY) / this.scale});
            }else if(selectedTool === "pan"){
                this.offsetX = e.clientX - this.startX;
                this.offsetY = e.clientY - this.startY;
            }
        }
    }

    redrawShapes() {
        this.ctx.strokeStyle = "white";
    
        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "pencil") {
                if(!shape.points){
                    return;
                }
                this.ctx.beginPath();
                shape.points.forEach(({ x, y }) => {
                    this.ctx.lineTo(x, y);
                    this.ctx.stroke();
                });
                this.ctx.closePath();
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

