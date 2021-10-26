import { randomHex } from "./generator.js";
import { ui } from "./UI.js";
import { hook } from "./hook.js";

const COLOR_FIELD = hook(".color-field");
const COLOR_SCHEME = hook(".color-scheme", false, COLOR_FIELD);

class events {
    constructor() {}

    addBtn_handler(len) {
        const hex = `#${randomHex()}`;
        
        const bar = document.createElement("div");

        bar.className = "color-bar";
        bar.innerHTML = `<div class="color-bg"></div>
        <div class="color-body">
            <div class="color-tools">
                <button class="btn btn-md btn-color btn-remove" data-tippy-content="remove color">
                    <i class="ri-delete-bin-7-line"></i>
                </button>
                <button class="btn btn-md btn-color btn-copy" data-tippy-content="copy color code">
                    <i class="ri-clipboard-line"></i>
                </button>
                <button class="btn btn-md btn-color btn-lock" data-tippy-content="lock color">
                    <i class="ri-lock-unlock-line"></i>
                </button>
            </div>
            <div class="color-info">
                <div class="color-code"></div>
                <div class="color-name"></div>
            </div>
        </div>`

        if(len === 2) {
            hook(".btn-remove", true, COLOR_SCHEME).forEach(btn => btn.style.display = "block");
        }

        COLOR_SCHEME.appendChild(bar);
        ui.updateColor(bar, hex);
        return;
    }

    // copy btn
    copyBtn_handler(bar) {
        const code = hook(".color-code", false, bar).innerText;
        window.navigator.clipboard.writeText(code);
        return;
    }

    // lock btn
    lockBtn_handler(bar, isLock) {
        let icon;
        isLock = isLock === "true" ? true : false;
        const lockBtn = hook(".btn-lock", false, bar);

        if(isLock) {
            icon = `<i class="ri-lock-unlock-line"></i>`;
            lockBtn.classList.remove("lock");
        } else {
            icon = `<i class="ri-lock-line"></i>`;
            lockBtn.classList.add("lock");
        }
        bar.setAttribute("data-isLock", `${!isLock}`);
        lockBtn.innerHTML = icon;
    }

    // remove btn
    removeBtn_handler(bar, len) {

        if(len >= 3) {
            bar.remove();
        }
        
        if(len <= 3) {
            hook(".btn-remove", true, COLOR_SCHEME).forEach(btn => btn.style.display = "none");
        }

    }
}

export const Events = new events()