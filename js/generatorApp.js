import {generator} from './modules/generator.js';
import {hook} from './modules/hook.js';

const COLOR_FIELD = hook(".color-field");
const TOOLS = hook(".tools");
const NAV = hook(".nav");
const tippy = window.tippy;

// TOOLS
const generateBtn = hook(".btn-generate");


// MODULE
function setTooltip() {
    tippy("button");
    return;
}

function _init() {
    setTooltip();
    generator();
}

// EVENT
document.addEventListener("DOMContentLoaded", e => {
    _init();
});

// generate button
generateBtn.addEventListener("click", generator);
generateBtn.addEventListener("dragstart", e => {

});

window.addEventListener("keydown", e => {
    // spacebar button
    if (e.code === "Space") generator();
});
