import { Enum } from "../utilities/enum.js";


export class DamageTypes extends Enum {
    static values = ["bludgeoning"];

    static BLUDGEONING = 0;

    static new_damage_details() {
        return {0: 0};
    }
}

export class DeathStates extends Enum {
    static values = ["alive", "dying", "dead"];

    static ALIVE = 0;
    static DYING = 1;
    static DEAD = 2;
}

export class CollisionTypes extends Enum {
    static values = ["rectangle", "circle"];

    static RECTANGLE = 0;
    static CIRCLE = 1;
}