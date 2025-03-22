import axios from "axios";
import { BACKEND_URL } from "../../configs/ServerUrls";

/*
   ` -> Declare types of shapes
    `-> initialize game class and declare private members
    `-> initialise constructor which takes canvas, roomId and ws instance
    `-> intialise destroy method which removes all the event listeners like mouseup, mousedown and mousemove
    `-> method to setTool
    `-> initialise async init function which get all existing shapes from BE and clear canvas
    `-> initialise initHandler which fills shape array on chat message
    `-> intialise clearCanvas function which clears whole canvas board and then re render all the shapes
    -> declare mouseUp, mouseDown and mouseMover handler functions for the the respective eventhandlers
    -> initialize initMouseHandlers which initialises all these handlers
*/ 

export type Tool = "circle" | "rect" | "pencil";

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
    type : "freeLine",
    startX : number,
    startY : number,
    endX : number,
    endY : number
}

export class Game {
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private existingShapes : Shape[];
    private roomId : string;
    private startX : number;
    private startY : number;
    private clicked : boolean;
    private selectedTool : Tool = "rect";
    private ws: WebSocket
    constructor(canvas : HTMLCanvasElement, roomId : string, ws : WebSocket){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
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
            if(event.type === "chat"){
                const parsedData = JSON.parse(message.message);
                console.log('Parse Data to add:', parsedData);
                this.existingShapes.push(parsedData);
                this.clearCanvas();
            }
        }
    }

    initMouseHandler() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

    mouseDownHandler = (e : any) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        console.log("Mouse down tool",this.selectedTool);
    }

    mouseUpHandler = (e : any) => {
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        console.log("Selected Tool", this.selectedTool);
        let shape : Shape | null = null;
        if(this.selectedTool === "rect"){
            shape = {
                type : "rect",
                x : this.startX,
                y : this.startY,
                width : width,
                height : height
            }
        }else if(this.selectedTool === "circle"){
            const radius = Math.max(height, width) / 2;
            shape = {
                type : "circle",
                centerX : this.startX + radius,
                centerY : this.startY + radius,
                radius : radius
            }
        }
        // console.log(shape);
        if(!shape){
            return;
        }
        console.log(shape);
        this.existingShapes.push(shape);
        console.log(JSON.stringify(shape));
        this.ws.send(JSON.stringify({
            type : "chat",
            message : JSON.stringify(shape),
            roomId : Number(this.roomId)
        }))
    }
    mouseMoveHandler = (e : any) => {
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            this.ctx.strokeStyle = "white"
            const selectedTool = this.selectedTool;
            if(selectedTool === "rect"){
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            }else if(selectedTool === "circle"){
                const radius = Math.max(width, height)/2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }
    clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            if(shape.type === "rect"){
                this.ctx.strokeStyle = "white"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }else if(shape.type === "circle"){
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();            
            }
        })
    }
}

