import { U } from "../utilities/utils.js";

export class Entity {
    constructor(globals, coordinate_x, coordinate_y, preloaded_image, sprite_size_x, sprite_size_y) {
        this.sprite_size_x=sprite_size_x; this.sprite_size_y=sprite_size_y;
        this.coordinate_x=coordinate_x; this.coordinate_y=coordinate_y;
        this.globals=globals;

        this.current_sprite = 0;

        this.preloaded_image = preloaded_image;

        this.sprite_sheet = new Image();
        this.sprite_sheet.src = this.preloaded_image.source;

        this.original_sprite_sheet = this.sprite_sheet;

        this.rotation = 0;
    }

    draw(ctx) {
        ctx.save()
        ctx.translate(
            (this.coordinate_x-this.globals.world_x) * this.globals.zoom,
            (this.coordinate_y-this.globals.world_y) * this.globals.zoom
        );
        ctx.rotate(this.rotation);
        ctx.drawImage(
            this.sprite_sheet,
            this.current_sprite * this.sprite_size_x,
            0,
            this.sprite_size_x, this.sprite_size_y,
            0, 0,
            this.sprite_size_x * this.globals.zoom, this.sprite_size_y * this.globals.zoom
        );
        ctx.restore();
    }

    colorize(r, g, b) {
        let imageSize = this.original_sprite_sheet.width;

        let offscreen = new OffscreenCanvas(imageSize, imageSize);
        let ctx = offscreen.getContext("2d");

        ctx.drawImage(this.original_sprite_sheet, 0, 0);

        let imageData = ctx.getImageData(0, 0, imageSize, imageSize);

        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i + 0] *= r;
            imageData.data[i + 1] *= g;
            imageData.data[i + 2] *= b;
        }

        ctx.putImageData(imageData, 0, 0);

        this.sprite_sheet = offscreen;
    }

    reset_color() {
        this.sprite_sheet = this.original_sprite_sheet;
    }
}

export class AnimatedEntity extends Entity {
    constructor(globals, coordinate_x, coordinate_y, preloaded_image, sprite_size_x, sprite_size_y) {
        super(globals, coordinate_x, coordinate_y, preloaded_image, sprite_size_x, sprite_size_y);

        this.frame_speed = 3;
        this.frame_current = 0;
    }

    draw(ctx) {
        ctx.drawImage(
            this.sprite_sheet,
            this.current_sprite * this.sprite_size_x,
            0,
            this.sprite_size_x, this.sprite_size_y,
            (this.coordinate_x*this.sprite_size_x-this.globals.world_x) * this.globals.zoom,
            (this.coordinate_y*this.sprite_size_y-this.globals.world_y) * this.globals.zoom,
            this.sprite_size_x * this.globals.zoom, this.sprite_size_y * this.globals.zoom
        );

        this.frame_current = this.frame_current + 1;
        if (this.frame_current >= this.frame_speed) {
            this.frame_current = 0;
        }

        if (this.frame_current === 0) {
            this.current_sprite = this.current_sprite + 1;
            if (this.current_sprite >= this.sprite_sheet.width / this.sprite_size_x) {
                this.current_sprite = 0;
            }
        }
    }
}
