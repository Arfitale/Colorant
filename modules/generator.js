import {hook} from "./hook.js";
import {ntc} from "./ntc.js";
import tinycolor from "./tinyColor.js";

ntc.init()

export function generator() {
    const COLOR_BAR = hook(".color-bar", true);

    COLOR_BAR.forEach(bar => {
        let colorBg = bar.querySelector('.color-bg');
        const hexColor = `#${randomHex()}`;
        const colorName = ntc.name(hexColor)[1];
        const isLight = tinycolor(hexColor).isLight();

        colorBg.style.backgroundColor = hexColor;
    });
}

function randomHex() {
    const randomize = ["A", "B", "C", "D", "E", "F", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const res = [];
    for (let x = 0; x < 6; x++) {
        res.push(randomize[Math.floor(Math.random() * randomize.length)]);
    }

    return res.join("");
}