import { Framing } from "./../bg/frame.js";
import { TextHandler } from "./../text/text.js";
import { MainMenu } from "./main_menu.js";

export class WorldData {
    powers = [];
    set_stage(stage) {}
    draw(ctx) {}
    think() {}
}

export class BaseStage {
    constructor(world_data, sound_box, globals) {
        this.world_data = world_data;
        this.world_data.set_stage(this);
        this.background_elements = [];
        this.creatures = [];
        this.obstructions = [];
        this.effects = [];
        this.frame = new Framing();
        this.new_stage = false;
        this.timer = 0;
        this.sound_box = sound_box;
        globals.current_stage = this;
        this.globals = globals;
    }

    get_globals() {
        return this.globals;
    }

    draw(ctx) {
        ctx.beginPath();
        this.frame.draw_background(ctx);
        ctx.closePath();

        ctx.beginPath();
        this.world_data.draw(ctx);
        ctx.closePath();

        for (let i = 0; i < this.background_elements.length; i++) {
            ctx.beginPath();
            this.background_elements[i].draw(ctx);
            ctx.closePath();
        }

        for (let i = 0; i < this.creatures.length; i++) {
            ctx.beginPath();
            this.creatures[i].draw(ctx);
            ctx.closePath();
        }

        for (let i = 0; i < this.obstructions.length; i++) {
            ctx.beginPath();
            this.obstructions[i].draw(ctx);
            ctx.closePath();
        }

        for (let i = this.effects.length - 1; i >= 0; i--) {
            ctx.beginPath();
            this.effects[i].draw(ctx);
            ctx.closePath();
        }

        ctx.beginPath();
        this.frame.draw_foreground(ctx);
        ctx.closePath();

        ctx.beginPath();
        this.sound_box.draw(ctx);
        ctx.closePath();
    }

    action(controls) {
        this.world_data.think(controls)
    }

    passive_think(controller) {
        this.effects.forEach((effect, index) => {
            effect.think();
            if (effect.is_done) {
                this.effects.splice(index, 1);
            }
        });
    }

    get_obstruction_at(tx, ty) {
        for(let x = 0; x < this.obstructions.length; x++) {
            if (this.obstructions[x].do_collide(tx, ty).collision) {
                return this.obstructions[x];
            }
        }
        return undefined;
    }

    spawn_effect(target, effect) {
        // this.effects.push(PowerEnum.as_effect(this.globals, effect, target));
    }

    change_stage() {
        return this.new_stage;
    }

    play_sound(sound_title) {
        this.sound_box.play(sound_title);
    }

    play_sound_once(sound_title) {
        this.sound_box.play_once(sound_title);
    }

    play_music(sound_title) {
        this.sound_box.music(sound_title);
    }
}