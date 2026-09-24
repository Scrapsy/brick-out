export class Pointer {
    think(controller) {
        this.controller = controller;
        this.x = controller.mouse_x;
        this.y = controller.mouse_y;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        // ctx.fillRect(this.x, this.y, 1, 1);
        ctx.moveTo(this.x-2, this.y-2);
        ctx.lineTo(this.x+2, this.y+2);
        ctx.moveTo(this.x-2, this.y+2);
        ctx.lineTo(this.x+2, this.y-2);
        ctx.stroke();
        ctx.closePath();
    }
}