import {generator} from './modules/generator.js';
import {hook} from './modules/hook.js';
import {eventHandler} from './modules/eventHandler.js';
import {ui} from './modules/UI.js';
import {tooltip} from './modules/tooltip.js';
import App from "./modules/app.js";

const COLOR_FIELD = hook(".color-field");
const COLOR_SCHEME = hook(".color-scheme", false, COLOR_FIELD);

const generateBtn = hook(".btn-generate", false, COLOR_FIELD);
const addBtn = hook(".btn-add", false , COLOR_FIELD);
const saveBtn = hook(".btn-save", false, COLOR_FIELD);
const savePalleteForm = document.querySelector("#save-pallete-form");

// UI
const overlay = document.querySelector(".overlay");

// STORAGE
const ls = window.localStorage;

// APP

// EVENT
window.onresize = () => {
    ui.updateDimension();
}

document.addEventListener("DOMContentLoaded", () => {
    _init();

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

    window.addEventListener("keydown", event => {
        // spacebar button
        if(event.code === "Space") generator();
    });

    // click event
    window.addEventListener("click", event => {
        const target = event.target;

        // login modal
        if(target.classList.contains("btn-close-login-modal")) {
            overlay.classList.toggle("active");
            eventHandler.showLoginModal();
        }

        // account bar
        if(target.classList.contains("account-ctr") || target.matches(".overlay.account") || target.classList.contains("btn-account-setting-close")) {
            const accountSettings = document.querySelector(".account-settings-ctr");

            accountSettings.classList.toggle("show");
            overlay.classList.toggle("active");
            overlay.classList.toggle("account");
        }

        // signout btn
        if(target.classList.contains("signout-btn") && App.isLogin()) {
            window.localStorage.removeItem("colorant_user");
            window.location.reload();
        }

        // bookmark btn
        if(target.classList.contains("btn-bookmark") || target.classList.contains("btn-bookmark-close") || target.matches(".overlay.bookmark")) {
            eventHandler.bookmarkBtn_handler();
            overlay.classList.toggle("active");
            overlay.classList.toggle("bookmark");
        }

        // save pallete btn
        if(target.classList.contains("btn-save-pallete") || target.classList.contains("btn-save-pallete-close")) {
            overlay.classList.toggle("active");
            
            if(!App.isLogin()) {
                eventHandler.showLoginModal();
                return;
            }

            const currentPallete = _getPalletes();
            eventHandler.savePalleteBtn_handler(currentPallete);
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

    // FORMS
    savePalleteForm.addEventListener("submit", event => {
        event.preventDefault();
        const palleteName = savePalleteForm.palleteName.value;
        const palleteDescription = savePalleteForm.palleteDescription.value;
        const pallete = _getPalletes();

        if(palleteName && palleteDescription) {
            const currentAccount = JSON.parse(ls.getItem("colorant_user")) || [];
            const colorLibrary = currentAccount.colorLibrary || [];
            const newPallete = {palleteName, pallete, palleteDescription}

            currentAccount.colorLibrary = [...colorLibrary, newPallete];
            ls.setItem("colorant_user", JSON.stringify(currentAccount));
        }
    });
});


// MAIN FUNCTION
function _init() {
    if(App.isLogin()) {
        App.userLoginHandler_generatorApp();
    } else {
        App.onLogout();
    }
    _onUpdate();
    generator();
    tooltip.initialize(".tippy");
}

function _onUpdate() {
    ui.updateDimension();
}

function _getPalletes() {
    const colorBars = document.querySelectorAll(".color-scheme .color-bar");
    let colorList = [];

    for(let x = 0; x < colorBars.length; x++) {
        const colorCode = colorBars[x].querySelector(".color-code").innerText;
        colorList.push(colorCode);
    }

    return colorList;
}