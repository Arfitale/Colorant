import tinycolor from "./tinyColor.js";
import {ntc} from "./ntc.js";
import {hook} from "./hook.js";


ntc.init();

const darkColorMode = "#202020";
const lightColorMode = "#dddddd";


export function updateUI(colorBar, hexColor) {
    const isLight = tinycolor(hexColor).isLight();
    const colorName = ntc.name(hexColor)[1];

    contrastUI(colorBar, isLight)
    updateColorBar(colorBar, hexColor, colorName);
}

function contrastUI(colorBar, isLight) {
    const btn = hook(`.btn`, true, colorBar);
    const colorName = hook(`.color-name`, false, colorBar);
    const colorCode = hook(`.color-code`, false, colorBar);

    if (isLight) {
        btn.forEach(el => el.style.color = darkColorMode);
        colorCode.style.color = darkColorMode;
        colorName.style.color = darkColorMode;
    } else {
        btn.forEach(el => el.style.color = lightColorMode);
        colorCode.style.color = lightColorMode;
        colorName.style.color = lightColorMode;
    }
}

function updateColorBar(colorBar, hexColor, colorName) {
    const colorBg = hook(".color-bg", false, colorBar);
    colorBg.style.backgroundColor = hexColor;
    hook(".color-code", false, colorBar).innerHTML = hexColor.replace("#", "");
    hook(".color-name", false, colorBar).innerHTML = colorName;
}
