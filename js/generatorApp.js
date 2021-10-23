import {generator} from './modules/generator.js';
import {hook} from './modules/hook.js';
import {Events} from './modules/eventHandler.js';
import {ui} from './modules/UI.js';

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

// event on color bar
COLOR_SCHEME.addEventListener("click", e => {
    if(e.target.classList.contains("btn")) {
        const target = e.target;
        const bar = e.target.parentElement.parentElement.parentElement;

        // copy button
        if(target.classList.contains("btn-copy")) {
            Events.copyBtn_handler(bar);
            ui.showMessage("copied to clipboard!", "success");
        }

        // lock function
        if(target.classList.contains("btn-lock")) {
            target.blur();
            
            const isLock = bar.getAttribute("data-isLock");
            Events.lockBtn_handler(bar, isLock);
        }
    }
});