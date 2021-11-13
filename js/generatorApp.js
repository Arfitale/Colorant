import {generator} from './modules/generator.js';
import {hook} from './modules/hook.js';
import {Events} from './modules/eventHandler.js';
import {ui} from './modules/UI.js';
import {tooltip} from './modules/tooltip.js';

const COLOR_FIELD = hook(".color-field");
const COLOR_SCHEME = hook(".color-scheme", false, COLOR_FIELD);
const TOOLS = hook(".tools");
const NAV = hook(".nav");
const generateBtn = hook(".btn-generate");
const addBtn = hook(".btn-add");

let colorBars = hook(".color-bar", true, COLOR_SCHEME);
let menuBtn = hook(".btn-menu", false, NAV);
let mobileDimensionX = 768;


// MODULE
function _init() {
    tooltip.initialize(".btn");
    _onUpdate();
    generator();
}

function _onUpdate() {
    ui.updateDimension();
}
// EVENT
window.onresize = () => {
    ui.updateDimension()
}

document.addEventListener("DOMContentLoaded", event => {
    _init();
});

// generate button
generateBtn.addEventListener("click", generator);

// add btn
addBtn.addEventListener("click", event => {
    const barLen = [...hook(".color-bar", true)].length;
    if(barLen < 7) {
        Events.addBtn_handler(barLen, tooltip);
        tooltip.refresh();
        _onUpdate();
    } else {
        ui.showMessage("color bar is fully added", "alert");
    }
})

window.addEventListener("keydown", event => {
    // spacebar button
    if(event.code === "Space") generator();
});

// event on color bar

// click event
window.addEventListener("click", event => {
    // overlay
    if(event.target.classList.contains("overlay")) {
        Events.menuBtn_handler(menuBtn);
    }
});

COLOR_SCHEME.addEventListener("click", event => {
    if(event.target.classList.contains("btn")) {
        event.target.blur()
        const target = event.target;
        const bar = event.target.parentElement.parentElement.parentElement;

        // copy button
        if(target.classList.contains("btn-copy")) {
            Events.copyBtn_handler(bar);
            ui.showMessage("copied to clipboard!", "success");
        }

        // lock button
        if(target.classList.contains("btn-lock")) {
            const isLock = bar.getAttribute("data-isLock");
            Events.lockBtn_handler(bar, isLock);
        }

        // delete button
        if(target.classList.contains("btn-remove")) {
            const barLen = hook(".color-bar", true, COLOR_SCHEME).length;
            Events.removeBtn_handler(bar, barLen);
            ui.updateDimension();
        }

    }
});

menuBtn.addEventListener("click", event => {
    Events.menuBtn_handler(event.target);
})

// dragstart event
window.addEventListener("dragstart", event => {
    const target = event.target;
    if(target.classList.contains("btn-drag")) {
        const bar = target.parentElement.parentElement.parentElement;
        Events.dragStart_handler(bar, target);
    }
});

// dragend event
window.addEventListener("dragend", event => {
    const target = event.target;
    if(target.classList.contains("btn-drag")) {
        const bar = target.parentElement.parentElement.parentElement;
        Events.dragEnd_handler(bar, target);
    }
})

// dragmove event
window.addEventListener("dragover", event => {
    const dragBar = hook(".color-bar.dragged", false, COLOR_SCHEME);

    if(dragBar) Events.dragMove_handler(event, dragBar);
});