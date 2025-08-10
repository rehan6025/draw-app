import { styleText } from "util";
import { getExistingShapes } from "./http";

type Tool = "circle" | "rect" | "pencil";

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

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.socket = socket;

    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

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
          shape.x + this.offsetX,
          shape.y + this.offsetY,
          shape.width,
          shape.height
        );
      } else if (shape?.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX + this.offsetX,
          shape.centerY + this.offsetY,
          shape.radius,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
      } else if (shape?.type === "pencil") {
        if (shape.points.length > 1) {
          this.ctx.beginPath();
          this.ctx.moveTo(
            shape.points[0].x + this.offsetX,
            shape.points[0].y + this.offsetY
          );
          for (let i = 1; i < shape.points.length; i++) {
            this.ctx.lineTo(
              shape.points[i].x + this.offsetX,
              shape.points[i].y + this.offsetY
            );
          }
          this.ctx.stroke();
        }
      }
    });

    if (this.currentStroke && this.currentStroke.points.length > 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(
        this.currentStroke.points[0].x + this.offsetX,
        this.currentStroke.points[0].y + this.offsetY
      );
      for (let i = 1; i < this.currentStroke.points.length; i++) {
        this.ctx.lineTo(
          this.currentStroke.points[i].x + this.offsetX,
          this.currentStroke.points[i].y + this.offsetY
        );
      }
      this.ctx.stroke();
    }
  }

  mouseDownHandler(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const worldX = e.clientX - rect.left - this.offsetX;
    const worldY = e.clientY - rect.top - this.offsetY;

    console.log(
      "these are world coord , irresp of currnet post of screen",
      worldX
    );
    console.log(worldY);

    if (e.button === 1) {
      this.isPanning = true;
      this.panStartX = e.clientX;
      this.panStartY = e.clientY;
      console.log(
        "panning start here , these are current screen positions ",
        this.panStartX
      );
      console.log(this.panStartY);
      return;
    }

    this.clicked = true;
    this.startX = worldX;
    this.startY = worldY;
    console.log("these are start x and y", this.startX);
    console.log(this.startY);

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
    const worldX = e.clientX - rect.left - this.offsetX;
    const worldY = e.clientY - rect.top - this.offsetY;

    const width = worldX - this.startX;
    const height = worldY - this.startY;

    let shape: Shape = null;

    if (this.selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      shape = {
        type: "circle",
        centerX: this.startX + radius,
        centerY: this.startY + radius,
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
    const worldX = e.clientX - rect.left - this.offsetX;
    console.log(
      "offsetx is the diff in curr post  and current pan start ",
      this.offsetX
    );
    const worldY = e.clientY - rect.top - this.offsetY;
    const width = worldX - this.startX;
    const height = worldY - this.startY;

    this.clearCanvas();
    this.ctx.strokeStyle = "white";

    if (this.selectedTool === "rect") {
      this.ctx.strokeRect(
        this.startX + this.offsetX,
        this.startY + this.offsetY,
        width,
        height
      );
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      const centerX = this.startX + radius;
      const centerY = this.startY + radius;
      this.ctx.beginPath();
      this.ctx.arc(
        centerX + this.offsetX,
        centerY + this.offsetY,
        radius,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    } else if (this.selectedTool === "pencil") {
      this.currentStroke?.points.push({ x: worldX, y: worldY });
      this.clearCanvas();
    }
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
