class Animated {
    constructor(globals, x, y, sprite_sheet, sprite_size_x, sprite_size_y) {
        this.sprite_size_x=sprite_size_x; this.sprite_size_y=sprite_size_y;
        this.x=x+globals.world_x; this.y=y+globals.world_y;
        this.globals=globals;

        this.sprite_sheet = new Image();
        this.sprite_sheet.src = "./objects/assets/effects/" + sprite_sheet + ".png";

        this.current_sprite = 0;

        this.frame_speed = 2;
        this.frame_current = 0;

        this.is_done = false;
    }

    draw(ctx) {
        if (this.is_done) {
            return;
        }
        ctx.drawImage(
            this.sprite_sheet,
            this.current_sprite * this.sprite_size_x,
            0,
            this.sprite_size_x, this.sprite_size_y,
            this.x-this.globals.world_x, this.y-this.globals.world_y,
            this.sprite_size_x * this.globals.zoom, this.sprite_size_y * this.globals.zoom
        );

        this.frame_current = this.frame_current + 1;
        if (this.frame_current >= this.frame_speed) {
            this.frame_current = 0;
        }

        if (this.frame_current === 0) {
            this.current_sprite = this.current_sprite + 1;
            if (this.current_sprite >= this.sprite_sheet.width / this.sprite_size_x) {
                this.is_done = true;
            }
        }
    }

    think() { }
}

class ThetaAnimated extends Animated {
    constructor(globals, x, y, sprite_sheet, sprite_size_x, sprite_size_y, theta) {
        super(globals, x, y, sprite_sheet, sprite_size_x, sprite_size_y);
        this.theta=theta;
    }

    draw(ctx) {
        if (this.is_done) {
            return;
        }
        ctx.translate(
            this.x-this.globals.world_x + (this.sprite_size_x/2),
            this.y-this.globals.world_y + (this.sprite_size_y/2)
        );
        ctx.rotate(this.theta * Math.PI / 180);
        ctx.drawImage(
            this.sprite_sheet,
            this.current_sprite * this.sprite_size_x,
            0,
            this.sprite_size_x, this.sprite_size_y,
            0, 0,
            this.sprite_size_x * this.globals.zoom, this.sprite_size_y * this.globals.zoom
        );
        ctx.rotate(-(this.theta * Math.PI / 180));
        ctx.translate(
            -(this.x-this.globals.world_x + (this.sprite_size_x/2)),
            -(this.y-this.globals.world_y + (this.sprite_size_y/2))
        );

        this.frame_current = this.frame_current + 1;
        if (this.frame_current >= this.frame_speed) {
            this.frame_current = 0;
        }

        if (this.frame_current === 0) {
            this.current_sprite = this.current_sprite + 1;
            if (this.current_sprite >= this.sprite_sheet.width / this.sprite_size_x) {
                this.is_done = true;
            }
        }
    }
}

class ScatterEffect {
    constructor(globals, coordinate_x, coordinate_y, sprite_sheet, sprite_size_x, sprite_size_y) {
        this.sprite_size_x=sprite_size_x; this.sprite_size_y=sprite_size_y;
        this.coordinate_x=coordinate_x; this.coordinate_y=coordinate_y;
        this.globals=globals;
        this.sprite_sheet=sprite_sheet;

        this.x = (this.coordinate_x*this.globals.tile_size-this.globals.world_x) * this.globals.zoom,
        this.y = (this.coordinate_y*this.globals.tile_size-this.globals.world_y) * this.globals.zoom,

        this.glimmers = [];
        this.spawn_rate = 5;
        this.spawn_count = 5;
        this.spawn_counter = 0;
        this.spawn_next_counter = 0;

        this.is_done = false;
    }

    draw(ctx) {
        for (let i = 0; i < this.glimmers.length; i++) {
            let glimmer = this.glimmers[i];
            glimmer.draw(ctx);
        }
        this.glimmers.forEach((glimmer, index) => {
            if (glimmer.is_done) {
                this.glimmers.splice(index, 1);
            }
        });
    }

    think() {
        if (this.spawn_count < this.spawn_counter) {
            if (this.glimmers.length === 0) {
                this.is_done = true;
            }
            return;
        }
        if (this.spawn_rate < this.spawn_next_counter) {
            this.spawn_next_counter = -1;
            this.spawn_counter += 1;
            this.spawn();
        }
        this.spawn_next_counter += 1;
    }

    spawn() {
        let rand_x = this.coordinate_x + (Math.random() * 20) - 10 - this.sprite_size_x / 2;
        let rand_y = this.coordinate_y + (Math.random() * 20) - 10 - this.sprite_size_y / 2;
        let theta = Math.random() * 360;
        this.glimmers.push(
            new ThetaAnimated(
                this.globals,
                rand_x,
                rand_y,
                this.sprite_sheet,
                this.sprite_size_x,
                this.sprite_size_y,
                theta
        ));
    }
}

export class FireEffect extends ScatterEffect {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, "flame", 10, 10);
    }
}

export class BallShardEffect extends ScatterEffect {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, "ball_shard", 10, 10);
    }
}