import { randomHex } from "./generator.js";
import { ui } from "./UI.js";
import { hook } from "./hook.js";

const COLOR_FIELD = hook(".color-field");
const COLOR_SCHEME = hook(".color-scheme", false, COLOR_FIELD);

class events {
    constructor() {}

    addBtn_handler() {
        const hex = `#${randomHex()}`;
        
        const bar = document.createElement("div");
        bar.className = "color-bar";
        bar.innerHTML = `<div class="color-bg"></div>
        <div class="color-body">
            <div class="color-tools">
                <button class="btn btn-md btn-color btn-remove" data-tippy-content="remove color">
                    <i class="ri-delete-bin-7-line"></i>
                </button>
                <button class="btn btn-md btn-color btn-drag" data-tippy-content="move color">
                    <i class="ri-drag-move-line"></i>
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
        COLOR_SCHEME.appendChild(bar);
        ui.updateColor(bar, hex);
    }
    
}

export const Events = new events()