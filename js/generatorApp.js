import {generator} from './modules/generator.js';
import {hook} from './modules/hook.js';
import {Events} from './modules/eventHandler.js';

const COLOR_FIELD = hook(".color-field");
const COLOR_SCHEME = hook(".color-scheme", false, COLOR_FIELD);
const TOOLS = hook(".tools");
const NAV = hook(".nav");
const tippy = window.tippy;

// TOOLS
const generateBtn = hook(".btn-generate");
const addBtn = hook(".btn-add");


// MODULE
function setTooltip() {
    tippy("button");
    return;
}

function _init() {
    setTooltip();
    generator();
}

function _onUpdate() {
    setTooltip();
}

// EVENT
document.addEventListener("DOMContentLoaded", e => {
    _init();
});

// generate button
generateBtn.addEventListener("click", generator);

// add btn
addBtn.addEventListener("click", e => {
    const barLen = [...hook(".color-bar", true)].length;
    if(barLen < 10) {
        Events.addBtn_handler();
        _onUpdate();
    };
})

window.addEventListener("keydown", e => {
    // spacebar button
    if(e.code === "Space") generator();
});
