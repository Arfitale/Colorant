import {hook} from "./hook.js";
import { ui as UI } from "./UI.js";

export function generator() {
    const COLOR_BAR = hook(".color-bar", true);

    COLOR_BAR.forEach(bar => {
        const hexColor = `#${randomHex()}`;

        UI.updateColor(bar, hexColor);
    });
}

// RANDOMIZE METHOD BY GENERATE RANDOM HEX CODE
export function randomHex() {
    const randomize = ["A", "B", "C", "D", "E", "F", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const res = [];
    for (let x = 0; x < 6; x++) {
        res.push(randomize[Math.floor(Math.random() * randomize.length)]);
    }

    return res.join("");
}
