import { BaseStage, WorldData } from "./base_stage.js";
import { TextHandler } from "../text/text.js";
import { FontEnum } from "../text/enum.js";
import { Obstruction } from "../objects/obstructions.js";
import { BottomLine } from "../objects/background_elements.js";
import { Ball, Paddle, Brick_1, Brick_2, Brick_3, Brick_4, Brick_5, Brick_6, Brick_7, Brick_8, Brick_9 } from "../objects/creatures.js";
import { Pointer } from "../utilities/pointer.js";
import { BlackFraming } from "../bg/frame.js";
import { MainMenu } from "./main_menu.js";
import { DeathStates } from "../objects/enums.js";

export class StageBattleField extends BaseStage {
    constructor(sound_box, globals) {
        let world_data = new WorldData();
        super(world_data, sound_box, globals);

        this.play_music("s_bobo");

        this.controller = undefined;
        this.text = [];
        // this.pointer = new Pointer();

        this.frame = new BlackFraming(globals);
        this.is_victory = false;
        this.is_dead = false;

        this.background_elements.push(
            new BottomLine(globals, 0, globals.c_height-8)
        );

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        this.creatures.push(new Brick_1(globals, globals.c_width/2-28, globals.c_height/2));
    }

    passive_think(controller) {
        super.passive_think(controller);
        this.controller = controller;

        if (this.controller.is_one) {
            for (let i = 0; i < this.creatures.length; i++) {
                if (this.creatures[i].alliance == "Brick") {
                    this.creatures[i].death_state = DeathStates.DYING;
                }
            }
        }

        // this.pointer.think(controller);

        if (!this._has_bricks()) {
            if (!this.is_victory) {
                this.is_victory = true;
                this.text.push(TextHandler.forClearText("Victory!", this.globals.c_width/4, this.globals.c_height/3, 48));
                this.text.push(TextHandler.forClearText("Press space to continue", this.globals.c_width/3, this.globals.c_height/2, 24));
            }
            return;
        }

        if (!this._has_balls()) {
            let paddle = this.creatures[0];
            if (paddle.current_sprite > 2 && !this.is_dead) {
                this.is_dead = true;
                this.text.push(TextHandler.forClearText("Defeat!", this.globals.c_width/4, this.globals.c_height/3, 48));
                this.text.push(TextHandler.forClearText("Press space to retry", this.globals.c_width/3, this.globals.c_height/2, 24));
            } else if (paddle.current_sprite <= 2) {
                paddle.current_sprite += 1;
                this.creatures.push(new Ball(this.globals, paddle.coordinate_x + paddle.sprite_size_x/2, this.globals.c_height - 37));
            }
            return;
        }

        let dying_numbers = [];
        for (let i = 0; i < this.creatures.length; i++) {
            this.creatures[i].think(controller, this.creatures);
        }

        for (let i = 0; i < this.creatures.length; i++) {
            this.creatures[i].do_update();
            if (this.creatures[i].is_dying()) {
                dying_numbers.push(i);
                this.creatures[i].spawn_effect(this);
            }
        }

        for (let i = dying_numbers.length - 1; i >= 0; i--) {
            let die = dying_numbers[i];
            this.creatures.splice(die, 1);
        }
    }

    draw(ctx) {
        super.draw(ctx);

        for (let i = 0; i < this.text.length; i++) {
            this.text[i].draw(ctx);
        }

        // this.pointer.draw(ctx);
    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new StageBattle10(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattleField(this.sound_box, this.globals);
        }
        return false;
    }

    get_next_stage() {
        return false; //new StageText(this.sound_box, this.globals);
    }
    
    _has_bricks() {
        for (let i = 0; i < this.creatures.length; i++) {
            if (this.creatures[i].alliance === "Brick") {
                return true;
            }
        }
        return false;
    }

        _has_balls() {
        for (let i = 0; i < this.creatures.length; i++) {
            if (this.creatures[i].alliance === "Ball") {
                return true;
            }
        }
        return false;
    }
}

export class StageBattle1 extends StageBattleField {
    constructor(sound_box, globals) {
        super(sound_box, globals);

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        for (let i = 0; i < 11; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 120));
        }
        for (let i = 0; i < 11; i++) {
            this.creatures.push(new Brick_1(globals, i*56 + 24, 90));
        }
        for (let i = 0; i < 11; i++) {
            this.creatures.push(new Brick_1(globals, i*56 + 24, 150));
        }
        for (let i = 0; i < 11; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 60));
        }
    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new StageBattle2(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattle1(this.sound_box, this.globals);
        }
        return false;
    }
}


class StageBattle2 extends StageBattleField {
    constructor(sound_box, globals) {
        super(sound_box, globals);

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        for (let i = 0; i < 1; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 30));
        }
        for (let i = 0; i < 3; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 60));
        }
        for (let i = 0; i < 6; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 90));
        }
        for (let i = 0; i < 9; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 120));
        }
        for (let i = 0; i < 11; i++) {
            this.creatures.push(new Brick_2(globals, i*56, 150));
        }

        for (let i = 0; i < 1; i++) {
            this.creatures.push(new Brick_1(globals, 640-i*56-56, 180));
        }
        for (let i = 0; i < 3; i++) {
            this.creatures.push(new Brick_1(globals, 640-i*56-56, 210));
        }
        for (let i = 0; i < 6; i++) {
            this.creatures.push(new Brick_1(globals, 640-i*56-56, 240));
        }
        for (let i = 0; i < 9; i++) {
            this.creatures.push(new Brick_1(globals, 640-i*56-56, 270));
        }
        for (let i = 0; i < 11; i++) {
            this.creatures.push(new Brick_2(globals, 640-i*56-56, 300));
        }
    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new StageBattle3(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattle2(this.sound_box, this.globals);
        }
        return false;
    }
}

class StageBattle3 extends StageBattleField {
    constructor(sound_box, globals) {
        super(sound_box, globals);

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        for (let i = 0; i < 5; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 120));
        }

        for (let i = 0; i < 4; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 160));
        }

        for (let i = 0; i < 5; i++) {
            this.creatures.push(new Brick_2(globals, i*56, 200));
        }

        for (let i = 0; i < 5; i++) {
            this.creatures.push(new Brick_1(globals, 640-i*56-56, 120));
        }

        for (let i = 0; i < 4; i++) {
            this.creatures.push(new Brick_1(globals, 640-i*56-56, 160));
        }

        for (let i = 0; i < 5; i++) {
            this.creatures.push(new Brick_2(globals, 640-i*56-56, 200));
        }

        this.creatures.push(new Brick_3(globals, 320-27, 160));

        this.creatures.push(new Brick_1(globals, 320-27, 200));
    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new StageBattle4(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattle3(this.sound_box, this.globals);
        }
        return false;
    }
}

class StageBattle4 extends StageBattleField {
    constructor(sound_box, globals) {
        super(sound_box, globals);

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        this.creatures.push(new Brick_4(globals, 320-56, 120));

        this.creatures.push(new Brick_1(globals, 320-56*2, 120));
        this.creatures.push(new Brick_1(globals, 320+56*1, 120));

        this.creatures.push(new Brick_2(globals, 320-56*2, 148));
        this.creatures.push(new Brick_2(globals, 320+56*1, 148));

        this.creatures.push(new Brick_3(globals, 320-56, 176));
        this.creatures.push(new Brick_3(globals, 320, 176));

        this.creatures.push(new Brick_4(globals, 0, 148));
        this.creatures.push(new Brick_1(globals, 112, 148));
        this.creatures.push(new Brick_1(globals, 112, 176));
        this.creatures.push(new Brick_1(globals, 0, 204));

        this.creatures.push(new Brick_4(globals, 640-112, 148));
        this.creatures.push(new Brick_1(globals, 640-168, 148));
        this.creatures.push(new Brick_1(globals, 640-168, 176));
        this.creatures.push(new Brick_1(globals, 640-56, 204));
    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new StageBattle5(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattle4(this.sound_box, this.globals);
        }
        return false;
    }
}

class StageBattle5 extends StageBattleField {
    constructor(sound_box, globals) {
        super(sound_box, globals);

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        this.creatures.push(new Brick_5(globals, 27, 200));

        this.creatures.push(new Brick_2(globals, 0, 290));
        this.creatures.push(new Brick_2(globals, 56, 290));
        this.creatures.push(new Brick_3(globals, 112, 290));

        this.creatures.push(new Brick_5(globals, 640-27-56, 200));

        this.creatures.push(new Brick_2(globals, 640-56, 290));
        this.creatures.push(new Brick_2(globals, 640-112, 290));
        this.creatures.push(new Brick_3(globals, 640-168, 290));

        this.creatures.push(new Brick_1(globals, 320-56, 50));
        this.creatures.push(new Brick_1(globals, 320, 50));
        this.creatures.push(new Brick_1(globals, 320-112, 50));
        this.creatures.push(new Brick_1(globals, 320+56, 50));
        this.creatures.push(new Brick_1(globals, 320-168, 50));
        this.creatures.push(new Brick_1(globals, 320+112, 50));

        this.creatures.push(new Brick_1(globals, 320-27, 80));
        this.creatures.push(new Brick_1(globals, 320-27-56, 80));
        this.creatures.push(new Brick_1(globals, 320-27+56, 80));
        this.creatures.push(new Brick_1(globals, 320-27-112, 80));
        this.creatures.push(new Brick_1(globals, 320-27+112, 80));

        this.creatures.push(new Brick_1(globals, 320-56, 110));
        this.creatures.push(new Brick_1(globals, 320, 110));
        this.creatures.push(new Brick_1(globals, 320-112, 110));
        this.creatures.push(new Brick_1(globals, 320+56, 110));

        this.creatures.push(new Brick_1(globals, 320-27, 140));
        this.creatures.push(new Brick_1(globals, 320-27-56, 140));
        this.creatures.push(new Brick_1(globals, 320-27+56, 140));

        this.creatures.push(new Brick_1(globals, 320-56, 170));
        this.creatures.push(new Brick_1(globals, 320, 170));

        this.creatures.push(new Brick_1(globals, 320-27, 200));

        this.creatures.push(new Brick_1(globals, 320-56, 230));
        this.creatures.push(new Brick_1(globals, 320, 230));

        this.creatures.push(new Brick_1(globals, 320-27, 260));
        this.creatures.push(new Brick_1(globals, 320-27-56, 260));
        this.creatures.push(new Brick_1(globals, 320-27+56, 260));

        this.creatures.push(new Brick_1(globals, 320-56, 290));
        this.creatures.push(new Brick_1(globals, 320, 290));
        this.creatures.push(new Brick_1(globals, 320-112, 290));
        this.creatures.push(new Brick_1(globals, 320+56, 290));
    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new StageBattle6(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattle5(this.sound_box, this.globals);
        }
        return false;
    }
}

class StageBattle6 extends StageBattleField {
    constructor(sound_box, globals) {
        super(sound_box, globals);

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        for (let i = 0; i < 11; i++) {
            this.creatures.push(new Brick_2(globals, i*56, 30));
        }
        for (let i = 0; i < 9; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 60));
        }
        for (let i = 0; i < 5; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 90));
        }
        for (let i = 0; i < 3; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 120));
        }
        for (let i = 0; i < 1; i++) {
            this.creatures.push(new Brick_3(globals, i*56, 150));
        }
        for (let i = 0; i < 3; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 180));
        }
        for (let i = 0; i < 5; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 210));
        }
        for (let i = 0; i < 9; i++) {
            this.creatures.push(new Brick_1(globals, i*56, 240));
        }
        for (let i = 0; i < 11; i++) {
            this.creatures.push(new Brick_2(globals, i*56, 270));
        }

        this.creatures.push(new Brick_6(globals, 28*14+14, 120));
        this.creatures.push(new Brick_6(globals, 28*10+14, 150));
        this.creatures.push(new Brick_6(globals, 28*6+14, 150));
        this.creatures.push(new Brick_6(globals, 28*18+14, 210));
    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new StageBattle7(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattle6(this.sound_box, this.globals);
        }
        return false;
    }
}

class StageBattle7 extends StageBattleField {
    constructor(sound_box, globals) {
        super(sound_box, globals);

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        this.creatures.push(new Brick_7(globals, globals.c_width/2-28, 150));

        this.creatures.push(new Brick_2(globals, globals.c_width/2-28, 250));
        this.creatures.push(new Brick_2(globals, globals.c_width/2-28, 276));
        this.creatures.push(new Brick_3(globals, globals.c_width/2-28-56, 240));
        this.creatures.push(new Brick_3(globals, globals.c_width/2-28+56, 240));
        this.creatures.push(new Brick_1(globals, globals.c_width/2-28-112, 230));
        this.creatures.push(new Brick_1(globals, globals.c_width/2-28+112, 230));

        this.creatures.push(new Brick_6(globals, 69, 150));
        this.creatures.push(new Brick_6(globals, 536, 150));
        this.creatures.push(new Brick_6(globals, globals.c_width/2-13, 50));


        this.creatures.push(new Brick_3(globals, 520, 50));
        this.creatures.push(new Brick_3(globals, 56, 50));

        this.creatures.push(new Brick_1(globals, 520, 200));
        this.creatures.push(new Brick_1(globals, 576, 200));
        this.creatures.push(new Brick_1(globals, 464, 190));

        this.creatures.push(new Brick_1(globals, 56, 200));
        this.creatures.push(new Brick_1(globals, 112, 190));
        this.creatures.push(new Brick_1(globals, 0, 200));

    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new StageBattle8(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattle7(this.sound_box, this.globals);
        }
        return false;
    }
}

class StageBattle8 extends StageBattleField {
    constructor(sound_box, globals) {
        super(sound_box, globals);

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        this.creatures.push(new Brick_8(globals, 120, 464));
        this.creatures.push(new Brick_8(globals, 520-26, 464));

        for (let i = 0; i < 10; i++) {
            this.creatures.push(new Brick_1(globals, i*64+4, 250));
        }

        for (let i = 0; i < 10; i++) {
            this.creatures.push(new Brick_1(globals, i*64+4, 100));
        }

        for (let i = 0; i < 10; i++) {
            this.creatures.push(new Brick_2(globals, i*64+4, 290));
        }

        this.creatures.push(new Brick_3(globals, 640-64+4, 210));
        this.creatures.push(new Brick_3(globals, 4, 210));
        this.creatures.push(new Brick_3(globals, 6*64+4, 210));
        this.creatures.push(new Brick_3(globals, 3*64+4, 210));

        this.creatures.push(new Brick_5(globals, 320-27, 150));
        this.creatures.push(new Brick_5(globals, 120-27, 150));
        this.creatures.push(new Brick_5(globals, 520-27, 150));
    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new StageBattle9(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattle8(this.sound_box, this.globals);
        }
        return false;
    }
}

class StageBattle9 extends StageBattleField {
    constructor(sound_box, globals) {
        super(sound_box, globals);

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        this.creatures.push(new Brick_9(globals, 314, 120));
        this.creatures.push(new Brick_9(globals, 120, 120));
        this.creatures.push(new Brick_9(globals, 504, 120));

        this.creatures.push(new Brick_5(globals, 320-27, 220));
    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new StageBattle10(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattle9(this.sound_box, this.globals);
        }
        return false;
    }
}

class StageBattle10 extends StageBattleField {
    constructor(sound_box, globals) {
        super(sound_box, globals);

        this.creatures = [
            new Paddle(globals, globals.c_width / 2 - 70, globals.c_height - 32),
            new Ball(globals, globals.c_width / 2 - 5, globals.c_height - 37),
        ];
        this.obstructions = [];

        this.creatures.push(new Brick_5(globals, 320-27, 220));
        this.creatures.push(new Brick_5(globals, 480-27, 220));

        this.creatures.push(new Brick_1(globals, 120, 160));

        this.creatures.push(new Brick_8(globals, 120, 460));
        this.creatures.push(new Brick_3(globals, 520, 400));

        this.creatures.push(new Brick_8(globals, 540, 460));
        this.creatures.push(new Brick_8(globals, 400, 460));
    }

    change_stage() {
        if (this.is_victory && this.controller.is_space) {
            return new MainMenu(this.sound_box, this.globals);
        } else if (this.is_dead && this.controller.is_space) {
            return new StageBattle10(this.sound_box, this.globals);
        }
        return false;
    }
}