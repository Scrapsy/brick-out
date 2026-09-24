import { PreloadImages } from "./assets.js";
import { Entity } from "./entity.js";
import { U } from "../utilities/utils.js";
import { DeathStates, CollisionTypes } from "./enums.js";
import { FireEffect, BallShardEffect } from "./effects.js";

class Creature extends Entity {
    constructor(globals, coordinate_x, coordinate_y, preloaded_image, sprite_size_x, sprite_size_y) {
        super(globals, coordinate_x, coordinate_y, preloaded_image, sprite_size_x, sprite_size_y);

        this.alliance = "None";
        this.name = this.constructor.name + crypto.randomUUID();

        this.speed = 0;
        this.direction = 60;
        this.radius = 0;

        this.death_state = DeathStates.ALIVE;
    }

    draw(ctx) {
        super.draw(ctx);
    }

    think(controller, creatures) {}

    is_dying() {
        return this.death_state === DeathStates.DYING;
    }

    do_update() {}

    spawn_effect(stage) {}
}

export class Ball extends Creature {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BALL, 14, 14);

        this.alliance = "Ball";

        this.speed = 6;
        this.acceleration = 0.05;
        this.radius = 7;
    }

    think(controller, creatures) {
        let step = U.unangle(this.direction);

        if (this.coordinate_x < 0) {
            step.x = -step.x;
            this.coordinate_x = 1;
            this.speed += this.acceleration;
        } else if (this.coordinate_y < 0) {
            step.y = -step.y;
            this.coordinate_y = 1;
            this.speed += this.acceleration;
        } else if (this.coordinate_x > this.globals.c_width - this.sprite_size_x) {
            step.x = -step.x;
            this.coordinate_x = this.globals.c_width - this.sprite_size_x - 1;
            this.speed += this.acceleration;
        } else if (this.coordinate_y > this.globals.c_height - this.sprite_size_y) {
            step.y = -step.y;
            this.coordinate_y = this.globals.c_height - this.sprite_size_y - 1;
            this.speed += this.acceleration;

            this.death_state = DeathStates.DYING;
            this.globals.current_stage.play_sound("s_explosion");
        }

        for (let i = 0; i < creatures.length; i++) {
            let creature = creatures[i];
            if (creature.name == this.name) { continue; }

            if (creature.alliance == "Paddle") {
                let distance = U.distanceBetween(
                    this.coordinate_x + 7,
                    this.coordinate_y + 7,
                    creature.coordinate_x + 70,
                    creature.coordinate_y + 32 + 68
                );

                if (distance < this.radius + creature.radius) {
                    let theta = U.angle(
                        this.coordinate_x + 7,
                        this.coordinate_y + 7,
                        creature.coordinate_x + 70,
                        creature.coordinate_y + 32 + 68
                    );
                    let collision_step = U.unangle(theta);
                    step.x = -(collision_step.x);
                    step.y = -(collision_step.y);
                    this.globals.current_stage.play_sound("s_click");
                }
            }

            if (creature.alliance == "Brick") {
                if (this.do_collision(creature, step, 0, 0)) { creature.struck(this); continue; }
                if (this.do_collision(creature, step, 14, 0)) { creature.struck(this); continue; }
                if (this.do_collision(creature, step, 0, 14)) { creature.struck(this); continue; }
                if (this.do_collision(creature, step, 14, 14)) { creature.struck(this); continue; }
            }
        }

        this.direction = U.angle(
            this.coordinate_x,
            this.coordinate_y,
            this.coordinate_x + step.x * this.speed,
            this.coordinate_y + step.y * this.speed
        );

        this.coordinate_x += step.x * this.speed;
        this.coordinate_y += step.y * this.speed;
    }

    do_collision(creature, step, padding_x, padding_y) {
        if (
            creature.is_collide(
                this.coordinate_x + padding_x + step.x * this.speed,
                this.coordinate_y + padding_y + step.y * this.speed
        )) {
            if (creature.collision_type == CollisionTypes.RECTANGLE) {
                if (creature.is_collide(
                    this.coordinate_x + padding_x + step.x * this.speed,
                    this.coordinate_y + padding_y
                )) {
                    step.x = -step.x;
                } else if (creature.is_collide(
                    this.coordinate_x + padding_x,
                    this.coordinate_y + padding_y + step.y * this.speed
                )) {
                    step.y = -step.y;
                } else {
                    step.x = -step.x;
                    step.y = -step.y;
                }
            } else if (creature.collision_type == CollisionTypes.CIRCLE) {
                let theta = U.angle(
                    this.coordinate_x + 7,
                    this.coordinate_y + 7,
                    creature.coordinate_x + creature.sprite_size_x/2,
                    creature.coordinate_y + creature.sprite_size_y/2
                );
                let collision_step = U.unangle(theta);
                step.x = -(collision_step.x);
                step.y = -(collision_step.y);
            }
            return true;
        }
        return false;
    }

    spawn_effect(stage) {
        stage.effects.push(
            new BallShardEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 2,
                this.coordinate_y + this.sprite_size_y / 2
            )
        );
    }
}

export class Paddle extends Creature {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.PADDLE, 140, 32);
        this.alliance = "Paddle";
        this.speed = 4;
        this.radius = 100;
    }

    think(controller, creatures) {
        if (controller.is_left) {
            this.coordinate_x -= this.speed;
        } else if (controller.is_right) {
            this.coordinate_x += this.speed;
        }

        if (this.coordinate_x < -(this.sprite_size_x / 2)) {
            this.coordinate_x = -(this.sprite_size_x / 2) + 1;
        } else if (this.coordinate_x > this.globals.c_width - this.sprite_size_x / 2) {
            this.coordinate_x = this.globals.c_width - this.sprite_size_x / 2 - 1;
        }

        for (let i = 0; i < creatures.length; i++) {
            let creature = creatures[i];
            if (creature.constructor.name == "Brick_8") {
                if (
                    creature.coordinate_x + creature.sprite_size_x > this.coordinate_x &&
                    creature.coordinate_x + creature.sprite_size_x / 2 < this.coordinate_x
                ) {
                    this.coordinate_x = creature.coordinate_x + creature.sprite_size_x;
                } else if (
                    creature.coordinate_x + creature.sprite_size_x /2 > this.coordinate_x  + this.sprite_size_x &&
                    creature.coordinate_x < this.coordinate_x + this.sprite_size_x
                ) {
                    this.coordinate_x = creature.coordinate_x - this.sprite_size_x;
                }
            }
        }
    }
}

class Brick extends Creature {
    constructor(globals, coordinate_x, coordinate_y, preloaded_image, sprite_size_x, sprite_size_y) {
        super(globals, coordinate_x, coordinate_y, preloaded_image, sprite_size_x, sprite_size_y);

        this.alliance = "Brick";
        this.collision_type = CollisionTypes.RECTANGLE;
    }

    is_collide(ox, oy) {
        return this.coordinate_x < ox && this.coordinate_x + this.sprite_size_x > ox &&
            this.coordinate_y < oy && this.coordinate_y + this.sprite_size_y > oy;
    }

    struck(ball) {}
}

export class Brick_1 extends Brick {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BRICK_ONE, 56, 28);
    }

    struck(ball) {
        this.death_state = DeathStates.DYING;

        this.globals.current_stage.play_sound("s_click");
    }

    spawn_effect(stage) {
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 2,
                this.coordinate_y + this.sprite_size_y / 2
            )
        );
    }
}

export class Brick_2 extends Brick {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BRICK_TWO, 56, 28);
    }

    struck(ball) {
        if (this.current_sprite == 0) { this.current_sprite = 1; }
        else { this.death_state = DeathStates.DYING; }

        this.globals.current_stage.play_sound("s_click");
    }

    spawn_effect(stage) {
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4,
                this.coordinate_y + this.sprite_size_y / 4
            )
        );
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + (this.sprite_size_x / 4) * 3,
                this.coordinate_y + (this.sprite_size_y / 4) * 3
            )
        );
    }
}

export class Brick_3 extends Brick {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BRICK_THREE, 56, 28);
    }

    struck(ball) {
        if (this.current_sprite < 2) {
            this.current_sprite += 1;
            this.globals.current_stage.play_sound("s_click");
        }
        else {
            this.death_state = DeathStates.DYING;
            this.globals.current_stage.play_sound("s_explosion");
        }
    }

    spawn_effect(stage) {
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4,
                this.coordinate_y + this.sprite_size_y / 4
            )
        );
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 2,
                this.coordinate_y + this.sprite_size_y / 2
            )
        );
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + (this.sprite_size_x / 4) * 3,
                this.coordinate_y + (this.sprite_size_y / 4) * 3
            )
        );
        let ball = new Ball(
                this.globals,
                this.coordinate_x + this.sprite_size_x/2 - 7,
                this.coordinate_y + this.sprite_size_y/2 - 7
            );
        ball.direction = Math.random() * 180 + 180;
        stage.creatures.push(
            ball
        );
    }
}

export class Brick_4 extends Brick {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BRICK_FOUR, 112, 56);
    }

    struck(ball) {
        if (this.current_sprite < 3) {
            this.current_sprite += 1;
            this.globals.current_stage.play_sound("s_click");
        }
        else {
            this.death_state = DeathStates.DYING;
            this.globals.current_stage.play_sound("s_explosion");
        }
    }

    spawn_effect(stage) {
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4,
                this.coordinate_y + this.sprite_size_y / 4
            )
        );

        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4 * 3,
                this.coordinate_y + this.sprite_size_y / 4
            )
        );

        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4,
                this.coordinate_y + this.sprite_size_y / 4 * 3
            )
        );

        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + (this.sprite_size_x / 4) * 3,
                this.coordinate_y + (this.sprite_size_y / 4) * 3
            )
        );
        stage.creatures.push(
            new Brick_1(this.globals, this.coordinate_x, this.coordinate_y)
        );
        stage.creatures.push(
            new Brick_1(this.globals, this.coordinate_x + this.sprite_size_x / 2, this.coordinate_y)
        );
        stage.creatures.push(
            new Brick_1(this.globals, this.coordinate_x, this.coordinate_y + this.sprite_size_y / 2)
        );
        stage.creatures.push(
            new Brick_1(this.globals, this.coordinate_x + this.sprite_size_x / 2, this.coordinate_y + this.sprite_size_y / 2)
        );
    }
}

export class Brick_5 extends Brick {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BRICK_FIVE, 56, 56);
        this.collision_type = CollisionTypes.CIRCLE;
    }

    is_collide(ox, oy) {
        let distance = U.distanceBetween(ox, oy, this.coordinate_x + 27, this.coordinate_y + 27);
        return distance < 27 + 7; // this.radius + ball.radius ... can't be arsed to add ball to this one
    }

    struck(ball) {
        if (this.current_sprite < 4) {
            this.current_sprite += 1;
            this.globals.current_stage.play_sound("s_click");
        }
        else {
            this.death_state = DeathStates.DYING;
            this.globals.current_stage.play_sound("s_explosion");
        }
        ball.speed += 1.5;
        
    }

    spawn_effect(stage) {
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 2,
                this.coordinate_y + this.sprite_size_y / 2
            )
        );

        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4,
                this.coordinate_y + this.sprite_size_y / 4
            )
        );

        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4 * 3,
                this.coordinate_y + this.sprite_size_y / 4
            )
        );

        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4,
                this.coordinate_y + this.sprite_size_y / 4 * 3
            )
        );

        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + (this.sprite_size_x / 4) * 3,
                this.coordinate_y + (this.sprite_size_y / 4) * 3
            )
        );
    }
}

export class Brick_6 extends Brick {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BRICK_SIX, 28, 28);
        this.collision_type = CollisionTypes.CIRCLE;
        this.is_exploding = false;

        this.frame_speed = 5;
        this.frame_count = 0;
    }

    is_collide(ox, oy) {
        let distance = U.distanceBetween(ox, oy, this.coordinate_x + 14, this.coordinate_y + 14);
        return distance < 14 + 7; // this.radius + ball.radius ... can't be arsed to add ball to this one
    }

    struck(ball) {
        this.is_exploding = true;
        this.globals.current_stage.play_sound("s_click");
    }

    think(controller, creatures) {
        if (this.is_exploding) {
            if (this.frame_count < this.frame_speed) {
                this.frame_count += 1;
            } else {
                this.frame_count = 0;
                this.current_sprite += 1;
            }
        }
        if (this.current_sprite >= 5) {
            this.death_state = DeathStates.DYING;
            this.globals.current_stage.play_sound("s_explosion");
        }
    }

    spawn_effect(stage) {
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 2,
                this.coordinate_y + this.sprite_size_y / 2
            )
        );
        for (let i = 0; i < 8; i++) {
            let shard = new Brick_6_Shard(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 2,
                this.coordinate_y + this.sprite_size_y / 2
            );
            shard.direction = i * 360 / 8;
            stage.creatures.push(
                shard
            );
        }
    }
}

export class Brick_6_Shard extends Ball {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y);

        this.preloaded_image = PreloadImages.BRICK_SIX_SHARD;
        this.sprite_size_x=12; this.sprite_size_y=9;

        this.sprite_sheet = new Image();
        this.sprite_sheet.src = this.preloaded_image.source;

        this.alliance = "Ball";

        this.speed = 6;
        this.acceleration = 0;
        this.radius = 6;
        this.rotation = this.direction;
    }

    think(controller, creatures) {
        let step = U.unangle(this.direction);

        if (this.coordinate_x < 0) {
            this.death_state = DeathStates.DYING;
            this.globals.current_stage.play_sound("s_click");
        } else if (this.coordinate_y < 0) {
            this.death_state = DeathStates.DYING;
            this.globals.current_stage.play_sound("s_click");
        } else if (this.coordinate_x > this.globals.c_width - this.sprite_size_x) {
            this.death_state = DeathStates.DYING;
            this.globals.current_stage.play_sound("s_click");
        } else if (this.coordinate_y > this.globals.c_height - this.sprite_size_y) {
            this.death_state = DeathStates.DYING;
            this.globals.current_stage.play_sound("s_click");
        }

        for (let i = 0; i < creatures.length; i++) {
            let creature = creatures[i];
            if (creature.name == this.name) { continue; }

            if (creature.alliance == "Brick") {
                if (this.do_collision(creature, step, 0, 0)) {
                    creature.struck(this);
                    this.death_state = DeathStates.DYING;
                    this.globals.current_stage.play_sound("s_click");
                    continue;
                }
                if (this.do_collision(creature, step, 14, 0)) {
                    creature.struck(this);
                    this.death_state = DeathStates.DYING;
                    this.globals.current_stage.play_sound("s_click");
                    continue;
                }
                if (this.do_collision(creature, step, 0, 14)) {
                    creature.struck(this);
                    this.death_state = DeathStates.DYING;
                    this.globals.current_stage.play_sound("s_click");
                    continue;
                }
                if (this.do_collision(creature, step, 14, 14)) {
                    creature.struck(this);
                    this.death_state = DeathStates.DYING;
                    this.globals.current_stage.play_sound("s_click");
                    continue;
                }
            }
        }

        this.direction = U.angle(
            this.coordinate_x,
            this.coordinate_y,
            this.coordinate_x + step.x * this.speed,
            this.coordinate_y + step.y * this.speed
        );

        this.coordinate_x += step.x * this.speed;
        this.coordinate_y += step.y * this.speed;

        this.rotation = this.direction;
    }

    spawn_effect(stage) {
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 2,
                this.coordinate_y + this.sprite_size_y / 2
            )
        );
    }
}

export class Brick_7 extends Brick {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BRICK_SEVEN, 56, 56);
    }

    struck(ball) {
        if (this.current_sprite < 6) {
            this.current_sprite += 1;
            this.globals.current_stage.play_sound("s_click");
        }
        else {
            this.death_state = DeathStates.DYING; 
            this.globals.current_stage.play_sound("s_explosion");
        }
        ball.death_state = DeathStates.DYING;
    }

    spawn_effect(stage) {
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4,
                this.coordinate_y + this.sprite_size_y / 4
            )
        );
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4 * 3,
                this.coordinate_y + this.sprite_size_y / 4
            )
        );
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 4,
                this.coordinate_y + this.sprite_size_y / 4 * 3
            )
        );
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + (this.sprite_size_x / 4) * 3,
                this.coordinate_y + (this.sprite_size_y / 4) * 3
            )
        );
    }
}

export class Brick_8 extends Brick {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BRICK_EIGHT, 26, 26);
        this.collision_type = CollisionTypes.CIRCLE;
    }

    is_collide(ox, oy) {
        let distance = U.distanceBetween(ox, oy, this.coordinate_x + 13, this.coordinate_y + 13);
        return distance < 13 + 7; // this.radius + ball.radius ... can't be arsed to add ball to this one
    }

    struck(ball) {
        this.death_state = DeathStates.DYING;
        this.globals.current_stage.play_sound("s_click");
    }

    spawn_effect(stage) {
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 2,
                this.coordinate_y + this.sprite_size_y / 2
            )
        );
    }
}

export class Brick_9 extends Brick {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BRICK_NINE, 26, 26);
    }

    struck(ball) {
        this.death_state = DeathStates.DYING;
        ball.speed = ball.speed / 2;
        this.globals.current_stage.play_sound("s_click");
    }

    spawn_effect(stage) {
        stage.effects.push(
            new FireEffect(
                this.globals,
                this.coordinate_x + this.sprite_size_x / 2,
                this.coordinate_y + this.sprite_size_y / 2
            )
        );
    }
}