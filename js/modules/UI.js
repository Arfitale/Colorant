import tinycolor from "./tinyColor.js";
import {ntc} from "./ntc.js";
import {hook} from "./hook.js";


ntc.init();


class UI {
    constructor() {
        this.darkColorMode = "#101010";
        this.lightColorMode = "#eeeeee";
    }

    updateColor(colorBar, hexColor) {
        const isLight = tinycolor(hexColor).isLight();
        const colorName = ntc.name(hexColor)[1];

        this.contrastUI(colorBar, isLight)
        this.updateColorBar(colorBar, hexColor, colorName);
    }

    updateColorBar(colorBar, hexColor, colorName) {
        const colorBg = hook(".color-bg", false, colorBar);
        colorBg.style.backgroundColor = hexColor;
        hook(".color-code", false, colorBar).innerHTML = hexColor.replace("#", "");
        hook(".color-name", false, colorBar).innerHTML = colorName;
    }

    contrastUI(colorBar, isLight) {
        const btn = hook(`.btn`, true, colorBar);
        const colorName = hook(`.color-name`, false, colorBar);
        const colorCode = hook(`.color-code`, false, colorBar);
    
        if (isLight) {
            btn.forEach(el => el.style.color = this.darkColorMode);
            colorCode.style.color = this.darkColorMode;
            colorName.style.color = this.darkColorMode;
        } else {
            btn.forEach(el => el.style.color = this.lightColorMode);
            colorCode.style.color = this.lightColorMode;
            colorName.style.color = this.lightColorMode;
        }
    }

    showMessage(text, type, time = 3000) {
        const newMessage = document.createElement("div");
        newMessage.className = `message message-${type}`;
        
        const ui = hook(".ui");
        const messageUI = hook(".messageUI", false, ui);

        newMessage.textContent = text;
        
        messageUI.innerHTML = "";
        messageUI.appendChild(newMessage);

        // final animation and remove this message
        setTimeout(() => {
            newMessage.classList.add("message-disappear");
            newMessage.addEventListener("animationend", () => newMessage.remove());
        }, time)
    }
}

export const ui = new UI();