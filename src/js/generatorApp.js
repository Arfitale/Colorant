import Main from './modules/main.js';
import GeneratorColor from './modules/generator.js';
import {hook} from './modules/hook.js';
import {eventHandler} from './modules/eventHandler.js';
import {ui} from './modules/UI.js';
import {tooltip} from './modules/tooltip.js';
import App from "./modules/app.js";

const COLOR_FIELD = hook(".color-field");
const COLOR_SCHEME = hook(".color-scheme", false, COLOR_FIELD);

const generateBtn = hook(".btn-generate", false, COLOR_FIELD);
const addBtn = hook(".btn-add", false , COLOR_FIELD);
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
    generateBtn.addEventListener("click", e => {
        GeneratorColor.defaultGenerate();
        _onUpdate();
    });

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
        if(event.code === "Space") {
            GeneratorColor.defaultGenerate();
            _onUpdate();
        };
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
            
            // Check if user is already login
            if(!App.isLogin()) {
                eventHandler.showLoginModal();
                return;
            }
            
            // Check if pallete is saved
            if(target.classList.contains("saved")) {
                eventHandler.unsaveBtn_handler(target);
            } else {
                const currentPallete = _getPalletes();
                eventHandler.savePalleteBtn_handler(currentPallete);
                overlay.classList.toggle("active");
            }
        }

        // unsave pallete btn
        if(target.classList.contains("pallete-saved")) {
            const currentID = COLOR_SCHEME.getAttribute("id");

            if(currentID) {
                let newColorLibrary = [];
                let {colorLibrary} = App.getUser();

                // ls
                newColorLibrary = colorLibrary.filter(pallete => pallete.id != currentID);
                App.updateUser("colorant_user", {...App.getUser(), colorLibrary: newColorLibrary});
                
                _onUpdate();
            }
        }

        // Bookmark - Showbtn
        if(target.classList.contains("btn-pallete-show")) {
            const bars = target.parentElement.parentElement.previousElementSibling.querySelectorAll(".bar");
            const id = target.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
            const pallete = [];

            for(let x = 0; x < bars.length; x++) {
                const colorData = {colorCode: bars[x].getAttribute("color-code"), colorName: bars[x].getAttribute("color-name")};
                pallete.push(colorData);
            }
            
            // set color scheme to this pallete
            COLOR_SCHEME.innerHTML = "";
            COLOR_SCHEME.setAttribute("id", id);

            for(let x = 0; x < pallete.length; x++) {
                const bar = document.createElement("div");
                const colorCode = pallete[x].colorCode;
                const colorName = pallete[x].colorName;

                bar.className = "color-bar";
                bar.innerHTML = `<div class="color-bg"></div>
                <div class="color-body">
                    <div class="color-tools">
                        <div class="btn btn-md btn-color btn-remove" role="button" data-tippy-content="remove color">
                            <i class="ri-delete-bin-7-line"></i>
                        </div>
                        <div class="btn btn-md btn-color btn-drag" role="button" data-tippy-content="move color" draggable="true">
                            <i class="ri-drag-move-line"></i>
                        </div>
                        <div class="btn btn-md btn-color btn-copy" role="button" data-tippy-content="copy color code">
                            <i class="ri-clipboard-line"></i>
                        </div>
                        <div class="btn btn-md btn-color btn-lock" role="button" data-tippy-content="lock color">
                            <i class="ri-lock-unlock-line"></i>
                        </div>
                    </div>
                    <div class="color-info">
                        <div class="color-code"></div>
                        <div class="color-name"></div>
                    </div>`

                    COLOR_SCHEME.appendChild(bar);
                    ui.updateColor(bar, colorCode, colorName);
                }

            _onUpdate();

            // remove overlay and bookmark state
            eventHandler.bookmarkBtn_handler();
            overlay.classList.toggle("active");
            overlay.classList.toggle("bookmark");
        }

        // Bookmark - RemovePallete btn
        if(target.classList.contains("btn-pallete-delete")) {
            const palleteItems = document.querySelectorAll(".pallete-library .pallete-item");
            const currentPallete = target.parentElement.parentElement.parentElement.parentElement;
            const currentID = currentPallete.getAttribute("id");
            const saveBtn = document.querySelector(".color-field .main-tools .btn-save-pallete");

            let newColorLibrary = [];
            let {colorLibrary} = App.getUser();

            // DOM
            for(let x = 0; x < palleteItems.length; x++) {
                const id = palleteItems[x].getAttribute("id");

                if(id === currentID) {
                    palleteItems[x].remove();
                }
            }

            saveBtn.classList.remove("saved");
            saveBtn.classList.remove("pallete-saved");

            // ls
            newColorLibrary = colorLibrary.filter(pallete => pallete.id != currentID);
            App.updateUser("colorant_user", {...App.getUser(), colorLibrary: newColorLibrary});
            
            _onUpdate();
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
                _onUpdate();
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
            _onUpdate();
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
        const colorNames = _getPalleteColorsName();
        const pallete = _getPalletes();
        const id = _getRandomID(Math.round(Math.random() * 15));

        if(palleteName && palleteDescription) {
            const currentAccount = JSON.parse(ls.getItem("colorant_user")) || [];
            const colorLibrary = currentAccount.colorLibrary || [];
            const newPallete = {id, palleteName, pallete, colorNames, palleteDescription}
            const saveBtn = document.querySelector(".btn-save-pallete");
            const savePalleteModal = document.querySelector(".save-pallete-modal");

            currentAccount.colorLibrary = [...colorLibrary, newPallete];
            ls.setItem("colorant_user", JSON.stringify(currentAccount));

            saveBtn.classList.add("saved");
            saveBtn.classList.add("pallete-saved");
            savePalleteModal.classList.remove("d-flex");
            overlay.classList.remove("active");

            // clear form
            savePalleteForm.palleteName.value = "";
            savePalleteForm.palleteDescription.value = "";

            // set id
            COLOR_SCHEME.setAttribute("id", id);
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
    GeneratorColor.defaultGenerate();
    tooltip.initialize(".tippy");
}

function _onUpdate() {
    if(App.isLogin()) {
        syncToColorLibrary();
    }

    ui.updateDimension();
}

function syncToColorLibrary() {
    const currentPalleteColorName = _getPalleteColorsName();
    const {colorLibrary} = App.getUser();
    const saveBtn = document.querySelector(".color-field .btn-save-pallete");

    for(let x = 0; x < colorLibrary.length; x++) {
        const palleteColorName = colorLibrary[x].colorNames;

        // if color pallete already saved in color library
        if(Main.isArrayEqual(currentPalleteColorName, palleteColorName)) {
            saveBtn.classList.add("saved");
            saveBtn.classList.add("pallete-saved");
            return;
        }
        // disable onSave state when color pallete doesn't saved
        saveBtn.classList.remove("saved");
        saveBtn.classList.remove("pallete-saved");

    }
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

function _getPalleteColorsName() {
    const colorBars = document.querySelectorAll(".color-scheme .color-bar");
    let colorNames = [];
    
    for(let x = 0; x < colorBars.length; x++) {
        const colorCode = colorBars[x].querySelector(".color-name").innerText;
        colorNames.push(colorCode);
    }

    return colorNames;
}

function _getRandomID(length = 5) {
    let id = "";
    const key = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    for(let x = 0; x < length; x++) {
        id = id.concat(key[Math.round(Math.random() * (key.length - 1))]);
    }

    return id;
}