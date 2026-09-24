import { GenericButton } from "./buttons.js";
import { FontEnum } from "../text/enum.js";
import { TextHandler } from "./../text/text.js";
import { BlackFraming } from "./../bg/frame.js";
import { StageBattle1, StageBattleField } from "./stage_battle.js";
import { Pointer } from "../utilities/pointer.js";

export class MainMenu {
    constructor(sound_box, globals) {
        this.options = [
            [
                new GenericButton(
                    globals.ctx.canvas.width/2, 200,
                    300, 40,
                    "Play"
                ),
                this.set_stage_battle
            ]
        ];
        this.text_title = TextHandler.forClearText("Welcome", globals.ctx.canvas.width/2-125, 130, 64, FontEnum.JACQUARD);
        this.run_stage = false;
        this.frame = new BlackFraming(globals);
        this.sound_box = sound_box;
        this.globals = globals;

        this.pointer = new Pointer();
    }

    draw(ctx) {
        ctx.beginPath();
        this.frame.draw_background(ctx);
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "#DDD";
        for (let i = this.options.length - 1; i >= 0; i--) {
            this.options[i][0].draw(ctx);
        }
        this.text_title.draw(ctx);
        ctx.closePath();

        ctx.beginPath();
        this.frame.draw_foreground(ctx);
        ctx.closePath();

        this.pointer.draw(ctx);
    }

    action(controls) {
        this.run_stage = false;
        if (controls.is_space) {
            this.run_stage = new StageBattle1(this.sound_box, this.globals);
        }
        if (controls.did_mouse_left_click) {
            for (let i = 0; i < this.options.length; i++) {
                if (this.options[i][0].did_collide(controls.mouse_x, controls.mouse_y)) {
                    this.sound_box.play("s_click");
                    this.options[i][1](this);
                }
            }
        }
    }

    passive_think(controller) {
        this.pointer.think(controller);
     }

    change_stage() {
        return this.run_stage;
    }

    set_stage_battle(master) {
        master.run_stage = new StageBattle1(master.sound_box, master.globals);
    }
}
