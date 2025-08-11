import { styleText } from "util";
import { getExistingShapes } from "./http";
import { Tool } from "@/components/Canvas";

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | { type: "pencil"; points: { x: number; y: number }[] }
  | null;

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[] = [];
  private roomId: string;
  socket: WebSocket;
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private currentStroke: {
    type: "pencil";
    points: { x: number; y: number }[];
  } | null = null;
  private offsetX = 0;
  private offsetY = 0;
  private isPanning = false;
  private panStartX = 0;
  private panStartY = 0;
  private scale = 1;
  private minScale = 0.2;
  private maxScale = 5;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.socket = socket;

    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseZoomHandler = this.mouseZoomHandler.bind(this);

    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "white";

    this.existingShapes.forEach((shape) => {
      if (shape?.type === "rect") {
        this.ctx.strokeRect(
          shape.x * this.scale + this.offsetX,
          shape.y * this.scale + this.offsetY,
          shape.width * this.scale,
          shape.height * this.scale
        );
      } else if (shape?.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX * this.scale + this.offsetX,
          shape.centerY * this.scale + this.offsetY,
          shape.radius * this.scale,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
      } else if (shape?.type === "pencil") {
        if (shape.points.length > 1) {
          this.ctx.beginPath();
          this.ctx.moveTo(
            shape.points[0].x * this.scale + this.offsetX,
            shape.points[0].y * this.scale + this.offsetY
          );
          for (let i = 1; i < shape.points.length; i++) {
            this.ctx.lineTo(
              shape.points[i].x * this.scale + this.offsetX,
              shape.points[i].y * this.scale + this.offsetY
            );
          }
          this.ctx.stroke();
        }
      }
    });

    if (this.currentStroke && this.currentStroke.points.length > 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(
        this.currentStroke.points[0].x * this.scale + this.offsetX,
        this.currentStroke.points[0].y * this.scale + this.offsetY
      );
      for (let i = 1; i < this.currentStroke.points.length; i++) {
        this.ctx.lineTo(
          this.currentStroke.points[i].x * this.scale + this.offsetX,
          this.currentStroke.points[i].y * this.scale + this.offsetY
        );
      }
      this.ctx.stroke();
    }
  }

  mouseDownHandler(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const worldX = (e.clientX - rect.left - this.offsetX) / this.scale;
    const worldY = (e.clientY - rect.top - this.offsetY) / this.scale;

    if (e.button === 1) {
      this.isPanning = true;
      this.panStartX = e.clientX;
      this.panStartY = e.clientY;

      return;
    }

    this.clicked = true;
    this.startX = worldX;
    this.startY = worldY;

    if (this.selectedTool === "pencil") {
      this.currentStroke = {
        type: "pencil",
        points: [{ x: worldX, y: worldY }],
      };
    }
  }

  mouseUpHandler(e: MouseEvent) {
    if (this.isPanning) {
      this.isPanning = false;
      return;
    }

    this.clicked = false;
    const rect = this.canvas.getBoundingClientRect();
    const worldX = (e.clientX - rect.left - this.offsetX) / this.scale;
    const worldY = (e.clientY - rect.top - this.offsetY) / this.scale;

    const width = worldX - this.startX;
    const height = worldY - this.startY;

    let shape: Shape = null;

    if (this.selectedTool === "rect") {
      let x = this.startX;
      let y = this.startY;
      let w = width;
      let h = height;

      if (w < 0) {
        x += w;
        w = Math.abs(w);
      }
      if (h < 0) {
        y += h;
        h = Math.abs(h);
      }

      shape = {
        type: "rect",
        x,
        y,
        width: w,
        height: h,
      };
    } else if (this.selectedTool === "circle") {
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

      shape = {
        type: "circle",
        centerX,
        centerY,
        radius,
      };
    } else if (this.selectedTool === "pencil") {
      shape = this.currentStroke;
      this.currentStroke = null;
    }

    if (!shape) return;

    this.existingShapes.push(shape);
    this.clearCanvas();

    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: Number(this.roomId),
        message: JSON.stringify({ shape }),
      })
    );
  }

  isMouseOverShape(mouseX: number, mouseY: number, shape: Shape) {
    if (shape?.type === "rect") {
      return (
        mouseX >= shape.x &&
        mouseX <= shape.x + shape.width &&
        mouseY >= shape.y &&
        mouseY <= shape.y + shape.height
      );
    }

    if (shape?.type === "circle") {
    }
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.isPanning) {
      const dx = e.clientX - this.panStartX;
      const dy = e.clientY - this.panStartY;
      this.offsetX += dx;
      this.offsetY += dy;
      this.panStartX = e.clientX;
      this.panStartY = e.clientY;
      this.clearCanvas();
      return;
    }

    if (!this.clicked) return;

    const rect = this.canvas.getBoundingClientRect();
    const worldX = (e.clientX - rect.left - this.offsetX) / this.scale;
    const worldY = (e.clientY - rect.top - this.offsetY) / this.scale;
    const width = worldX - this.startX;
    const height = worldY - this.startY;

    if (this.selectedTool === "pencil") {
      this.currentStroke?.points.push({ x: worldX, y: worldY });
    }

    if (this.selectedTool === "eraser") {
      this.existingShapes = this.existingShapes.filter(
        (shape) => !this.isMouseOverShape(worldX, worldY, shape)
      );
    }

    this.clearCanvas();

    this.ctx.strokeStyle = "white";

    if (this.selectedTool === "rect") {
      this.ctx.strokeRect(
        this.startX * this.scale + this.offsetX,
        this.startY * this.scale + this.offsetY,
        width * this.scale,
        height * this.scale
      );
    } else if (this.selectedTool === "circle") {
      const radius =
        (Math.max(Math.abs(width), Math.abs(height)) / 2) * this.scale;
      const centerX = (this.startX + width / 2) * this.scale + this.offsetX;
      const centerY = (this.startY + height / 2) * this.scale + this.offsetY;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  mouseZoomHandler(e: WheelEvent) {
    e.preventDefault();

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - this.offsetX) / this.scale;
    const worldY = (mouseY - this.offsetY) / this.scale;

    const zoomFactor = 1.1;
    let newScale = this.scale;

    if (e.deltaY < 0) {
      newScale = Math.min(this.maxScale, this.scale * zoomFactor);
    } else {
      //zoom out
      newScale = Math.max(this.minScale, this.scale / zoomFactor);
    }

    this.offsetX = mouseX - worldX * newScale;
    this.offsetY = mouseY - worldY * newScale;

    this.scale = newScale;

    this.clearCanvas();
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("wheel", this.mouseZoomHandler);
  }
}
