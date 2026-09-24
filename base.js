import { MainMenu } from "./stages/main_menu.js";
import { SoundBox } from "./soundbox/soundbox.js";
import { controller } from "./utilities/controller.js";

import { CreateStage } from "./stages/create_stage.js";

import { PreloadImages } from "./objects/assets.js";

let canvas = document.getElementById("region");
let ctx = canvas.getContext("2d");

const nr_fonts_to_load = 1;
let jacquard_font = new FontFace("JacquardaBastarda9", "url(./text/fonts/JacquardaBastarda9-Regular.ttf)");
var fonts_loaded = 0;
jacquard_font.load().then(function(font) {
    console.log("Font: " + font.family + " ready");
    document.fonts.add(font);
    fonts_loaded += 1;
});

let globals = class {
    canvas = false;
    ctx = false;
    tile_size = false;
    world_x = 0;
    world_y = 0;
    c_width = 0;
    c_height = 0;
    zoom = 1;
};
globals.canvas = canvas;
globals.ctx = ctx;
globals.tile_size = 70;
globals.world_x = 0;
globals.world_y = 0;
globals.c_width = canvas.getBoundingClientRect().width;
globals.c_height = canvas.getBoundingClientRect().height;
globals.zoom = 1;
let sound_box = new SoundBox(globals);

let current_stage = new MainMenu(sound_box, globals);
// let current_stage = new CreateStage(sound_box, globals);
let new_stage = false;

let loading_interval;

let load_canvas = new OffscreenCanvas(1000, 1000);
let load_context = load_canvas.getContext("2d");
let preloading_images = Object.keys(PreloadImages);
let nr_images_to_load = preloading_images.length;
let nr_images_loaded = 0;

for (let i = 0; i < preloading_images.length; i++) {
    setTimeout(
        function() {
            let img = new Image();
            img.src = PreloadImages[preloading_images[i]].source;
            load_context.drawImage(
                img,0,0
            );
            nr_images_loaded += 1;
        }, 500
    );
}

function loading() {
    let total_to_load = nr_fonts_to_load + nr_images_to_load;
    let total_loaded = fonts_loaded + nr_images_loaded;
    let width_section = ctx.canvas.width / total_to_load;

    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = "128px serif";
    ctx.fillStyle = "#333";
    ctx.fillText("Loading", 0, 200);
    ctx.fillText(total_loaded + "/" + total_to_load, 50, 300);
    ctx.stroke();

    ctx.fillStyle = "#333333";
    ctx.fillRect(0, 400, width_section*total_loaded, 20);

    if (total_loaded >= total_to_load) {
        clearInterval(loading_interval);
        setInterval(main_loop, UPDATES_IN_MS);
    }
}

function main_loop() {
    current_stage.draw(ctx);

    if (controller.did_event) {
        current_stage.action(controller);
    }
    current_stage.passive_think(controller);
    sound_box.action(controller);

    new_stage = current_stage.change_stage();
    if (new_stage) {
        current_stage = new_stage;
    }

    controller.action();
}

const UPDATES_PER_SECOND = 60;
const UPDATES_IN_MS = 1000/UPDATES_PER_SECOND;
loading_interval = setInterval(loading, UPDATES_IN_MS);
