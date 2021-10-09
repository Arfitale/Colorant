import {generator} from './modules/generator.js';
import {hook} from './modules/hook.js';

const COLOR_FIELD = hook(".color-field");
const TOOLS = hook(".tools");
const NAV = hook(".nav");

// TOOLS
const generateBtn = hook(".btn-generate");

function _init() {
    generator();
}

// EVENT
document.addEventListener("DOMContentLoaded", e => {
    _init();
});

// generate button
generateBtn.addEventListener("click", generator);

window.addEventListener("keydown", e => {
    // spacebar button
    if (e.code === "Space") generator();
});