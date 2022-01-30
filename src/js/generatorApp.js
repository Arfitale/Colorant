import {generator} from './modules/generator.js';
import {hook} from './modules/hook.js';
import {eventHandler} from './modules/eventHandler.js';
import {ui} from './modules/UI.js';
import {tooltip} from './modules/tooltip.js';
import {user} from "./modules/app.js";

const COLOR_FIELD = hook(".color-field");
const COLOR_SCHEME = hook(".color-scheme", false, COLOR_FIELD);

const generateBtn = hook(".btn-generate", false, COLOR_FIELD);
const addBtn = hook(".btn-add", false , COLOR_FIELD);
const saveBtn = hook(".btn-save", false, COLOR_FIELD);

// UI
const overlay = document.querySelector(".overlay");


// MAIN FUNCTION
function _init() {
    if(user.isLogin()) {
        user.onLogin();
    } else {
        user.onLogout();
    }
    _onUpdate();
    generator();
    tooltip.initialize(".btn");
}

function _onUpdate() {
    ui.updateDimension();
}

function onLogin() {
    const nav = document.querySelector(".nav");
    const navMain = nav.querySelector(".nav-main");
    const signLinks = navMain.querySelector(".sign");
    const account = nav.querySelector(".account");
    
    // style when user already login 
    signLinks.style.display = "none";
    account.style.display = "block";

    user.userLoginHandler();
}


function _getColors() {
    let colorList = [];
    let colorBars = hook(".color-bar", true, COLOR_SCHEME);

    for(let x = 0; x < colorBars.length; x++) {
        const bar = colorBars[x];
        const colorCode = hook(".color-code", false, bar);

        colorList.push(colorCode.textContent);
    }

    return colorList;
}

// EVENT
window.onresize = () => {
    ui.updateDimension();
}

document.addEventListener("DOMContentLoaded", () => {
    _init();
});

// generate button
generateBtn.addEventListener("click", generator);

// add btn
addBtn.addEventListener("click", () => {
    const barLen = [...hook(".color-bar", true)].length;
    if(barLen < 7) {
        eventHandler.addBtn_handler(barLen, tooltip);
        tooltip.refresh();
        _onUpdate();
    } else {
        ui.showMessage("color bar is fully added", "alert");
    }
})

// save btn
saveBtn.addEventListener("click", event => {
    eventHandler.saveBtn_handler(event.target, _getColors());
});

window.addEventListener("keydown", event => {
    // spacebar button
    if(event.code === "Space") generator();
});

// click event
window.addEventListener("click", event => {
    const target = event.target;

    if(target.classList.contains("account-ctr") || target.matches(".overlay.account")) {
        const accountSettings = target.parentElement.querySelector(".account-settings-ctr");

        accountSettings.classList.toggle("show");
        overlay.classList.toggle("active");
        overlay.classList.toggle("account");
    }

    // bookmark
    if(target.classList.contains("btn-bookmark") || target.classList.contains("btn-bookmark-close") || target.matches(".overlay.bookmark")) {
        eventHandler.bookmarkBtn_handler();
        overlay.classList.toggle("active");
        overlay.classList.toggle("bookmark");
    }

    // MOBILE //

    // menu btn
    if(target.classList.contains("btn-menu") || target.classList.contains("btn-close-nav")) {
        eventHandler.menuBtn_handler();
    }

});

COLOR_SCHEME.addEventListener("click", event => {
    if(event.target.classList.contains("btn")) {
        event.target.blur()
        const target = event.target;
        const bar = event.target.parentElement.parentElement.parentElement;

        // copy button
        if(target.classList.contains("btn-copy")) {
            eventHandler.copyBtn_handler(bar);
            ui.showMessage("copied to clipboard!", "success");
        }

        // lock button
        if(target.classList.contains("btn-lock")) {
            const isLock = bar.getAttribute("data-isLock");
            eventHandler.lockBtn_handler(bar, isLock);
        }

        // delete button
        if(target.classList.contains("btn-remove")) {
            const barLen = hook(".color-bar", true, COLOR_SCHEME).length;
            eventHandler.removeBtn_handler(bar, barLen);
            ui.updateDimension();
        }

    }
});

// dragstart event
window.addEventListener("dragstart", event => {
    const target = event.target;
    if(target.classList.contains("btn-drag")) {
        const bar = target.parentElement.parentElement.parentElement;
        eventHandler.dragStart_handler(bar, target);
    }
});

// dragend event
window.addEventListener("dragend", event => {
    const target = event.target;
    if(target.classList.contains("btn-drag")) {
        const bar = target.parentElement.parentElement.parentElement;
        eventHandler.dragEnd_handler(bar, target);
    }
})

// dragmove event
window.addEventListener("dragover", event => {
    const dragBar = hook(".color-bar.dragged", false, COLOR_SCHEME);

    if(dragBar) eventHandler.dragMove_handler(event, dragBar);
});