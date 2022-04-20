import { ui } from "./UI.js";
import {colors, colorName} from "../color.js";

export default class GeneratorColor {

    static defaultGenerate() {
        const COLOR_BAR = document.querySelectorAll(".color-field .color-bar");
    
        COLOR_BAR.forEach(bar => {
            let isLock = bar.getAttribute("data-isLock");
            isLock = isLock === "true" ? true : false;
    
            if (!isLock) {
                const [colorName, colorCode] = this.getRandomColor();

                // Set every color bars
                ui.updateColor(bar, `#${colorCode}`, colorName);
            }
        });
    }

    // get random color
    static getRandomColor() {
        const randomColorName = colorName[Math.round(Math.random() * colorName.length)];
        const colorCode = colors[randomColorName];

        return [randomColorName, colorCode];
    }
}