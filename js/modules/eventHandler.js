import { randomHex } from "./generator.js";
import { ui } from "./UI.js";
import { hook } from "./hook.js";

const COLOR_FIELD = hook(".color-field");
const COLOR_SCHEME = hook(".color-scheme", false, COLOR_FIELD);
const UI = hook(".ui");

class events {
    constructor() {
        this.desktopDimensionX = 1360;
        this.mobileDimensionX = 768;
        this.dragEvent = {
            posInit: 0,
            currentMousePos: 0,
            beforeMousePos: 0,
            mouseDirection: null,
            flagPos: null,
            collisionList: [],
            collisionIndex: null,
            collider: null,
            elements: [],
        }
    }

    menuBtn_handler() {
        const navBar = hook(".nav-main");
        const closeBtn = hook(".btn-close-nav");
        const menuBtn = hook(".btn-menu-mobile");

        navBar.classList.toggle("_inOverlay");
        closeBtn.classList.toggle("active");
        menuBtn.classList.toggle("invisible");
        ui.toggleOverlay();
    }

    saveBtn_handler(saveBtn, colorList) {
        if(saveBtn.classList.contains("saved")) {
            saveBtn.classList.remove("saved");
            return;
        } else {
            saveBtn.classList.add("saved");
            ui.showMessage(`${colorList} has been saved in the account database`, "success");
        }
    }

    bookmarkBtn_handler() {
        const bookmarkUI = hook(".bookmark", false, UI);

        bookmarkUI.classList.toggle("_inOverlay");
        ui.toggleOverlay();
    }

    addBtn_handler(len) {
        const hex = `#${randomHex()}`;
        const bar = document.createElement("div");

        bar.className = "color-bar add-anim";
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
                <div class="color-code">31F9A1</div>
                <div class="color-name">Crimson</div>
            </div>`

        if(len === 2) {
            hook(".btn-remove", true, COLOR_SCHEME).forEach(btn => btn.style.display = "block");
        }

        COLOR_SCHEME.appendChild(bar);
        ui.updateColor(bar, hex);

        bar.addEventListener("animationend", event => {
            bar.classList.remove("add-anim");
        })

    }

    // copy btn
    copyBtn_handler(bar) {
        const code = hook(".color-code", false, bar).innerText;
        return window.navigator.clipboard.writeText(code);
        
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
        return;
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

    overlay_handler() {
        const _inOverlay = hook("._inOverlay");
        _inOverlay.classList.remove("_inOverlay");
        ui.toggleOverlay();
    }

    dragStart_handler(bar, target) {
        const tools = hook(".color-tools", false, bar);
        const btns = hook(".btn:not(.btn-drag)", true, tools);

        // style bar 
        bar.style.zIndex = "99";
        bar.classList.add("dragged", "transition-none");

        // style btn 
        target.style.transform = "scale(1.1)";
        btns.forEach(btn => btn.classList.add("invisible"));

        // set collision pos
        hook(".color-bar", true, COLOR_SCHEME).forEach((bar, index) => {
            let collisionPos = Math.round(bar.getBoundingClientRect().width * (index + 1));
            this.dragEvent.collisionList.push(collisionPos);
        });

    }

    dragEnd_handler(bar, target) {
        const tools = hook(".color-tools", false, bar);
        const btns = hook(".btn:not(.btn-drag)", true, tools);
        let {posInit, currentMousePos, beforeMousePos, mouseDirection,  flagPos,  collisionList, collisionIndex, collider, elements} = this.dragEvent;
        let homePos = (100 / elements.length);

        // style bar
        bar.style.zIndex = "0";

        bar.classList.remove("dragged", "transition-none");
        bar.style.transform = `translateX(0)`;

        
        // style btn 
        target.style.transform = "scale(1)";
        btns.forEach(btn => btn.classList.remove("invisible"));
        
        // remove transition for while for every non dragged element to prevent bug transition
        elements.forEach(el => {
            el.classList.add("transition-none");
            el.style.transform = `translateX(0)`;
        });

        // determine new position
        if(mouseDirection === "right") {
            let newPos, barPos, isToRight = true;

            elements.forEach((el, index) => {

                // MOUSE DIRECTION STARTED FROM RIGHT
                if(index <= collisionIndex && index > collider) {
                    newPos = homePos * (index - 1);

                    el.style.left = `${newPos}%`;

                // MOUSE DIRECTION FROM LEFT DIRECTION THEN TO RIGHT
                } else if(index >= collisionIndex && index < collider) {
                    newPos = homePos * (index + 1);
                    isToRight = false;

                    el.style.left = `${newPos}%`;

                }

                // set dragged bar position
                barPos = homePos * collisionIndex;
                bar.style.left = `${barPos}%`;

            });

            if(isToRight) {
                COLOR_SCHEME.insertBefore(bar, elements[collisionIndex].nextElementSibling);
            } else {
                COLOR_SCHEME.insertBefore(bar, elements[collisionIndex]);
            }
            
        } else {
            let newPos, barPos, isToLeft = true;

            elements.forEach((el, index) => {
                
                // MOUSE DIRECTION STARTED FROM LEFT
                if(index >= collisionIndex && index < collider) {
                    newPos = homePos * (index + 1);
                    el.style.left = `${newPos}%`;

                // MOUSE DIRECTION FROM RIGHT DIRECTION THEN TO LEFT
                } else if(index <= collisionIndex && index > collider) {
                    isToLeft = false;
                    newPos = homePos * (index - 1);
                    el.style.left = `${newPos}%`;
                }

            });

            barPos = homePos * collisionIndex;
            bar.style.left = `${barPos}%`;

            if(isToLeft) {
                COLOR_SCHEME.insertBefore(bar, elements[collisionIndex]);
            } else {
                COLOR_SCHEME.insertBefore(bar, elements[collisionIndex].nextElementSibling);
            }

        }
        
        // set defalut every element bar
        elements.forEach(el => {
            el.classList.remove("transition-none");
        })

        // set drag event to default
        this.dragEvent = {
            posInit: 0,
            currentMousePos: 0,
            beforeMousePos: 0,
            mouseDirection: null,
            flagPos: null,
            collisionList: [],
            collisionIndex: null,
            collider: null,
            elements: [],
        }
    }

    dragMove_handler(event, dragBar) {
        const colorSchemeDimension = Math.floor(COLOR_SCHEME.getBoundingClientRect().width);
        const barDimension = Math.floor(dragBar.getBoundingClientRect().width);
        const posX = event.clientX;
        
        let {posInit, currentMousePos, beforeMousePos, mouseDirection,  flagPos,  collisionList, collisionIndex, collider, elements} = this.dragEvent;
        posInit = posInit || posX;
        elements = [...hook(".color-bar", true, COLOR_SCHEME)];
        collider = collider || elements.indexOf(dragBar);
        
        let moveX = posInit === posX ? 1 : posX - posInit;
        let bars = [...hook(".color-bar", true, COLOR_SCHEME)];
        currentMousePos = event.clientX;

        // DETERMINE MOUSE DIRECTION
        if(currentMousePos != beforeMousePos) {
            mouseDirection = currentMousePos - beforeMousePos > 0 ? "right" : "left";
        }


        // SET BAR POSITION WHILE MOVE
        dragBar.style.transform = `translateX(${moveX}px)`;

        // COLLISION HANDLER
        collisionList.forEach((collision, index) => {
            if(index === 0) {
                if(posX > 0 && posX < collision) {
                    return collisionIndex = index;
                }
            } else if(index === collisionList.length - 1) {
                if(posX > collisionList[index - 1] && posX < collision) {
                    return collisionIndex = index;
                }
            } else {
                if(posX > collisionList[index - 1] && posX < collision) return collisionIndex = index;
            }
        });

        if(collisionIndex != null) {

            // WHEN BAR SELECT IS ON END INDEX 
            if(collider >= collisionIndex) {
                if(mouseDirection === "left") {
                    elements.forEach((el, index) => {
                        if(index >= collisionIndex && index < collider && el != dragBar) {
                            el.style.transform = `translateX(${barDimension}px)`;
                        } 
                    })
                } else if(mouseDirection === "right") {
                    elements.forEach((el, index) => {
                        if(index + 1 <= collisionIndex) {
                            el.style.transform = `translateX(0px)`;
                        }
                    })
                }
            }

            // WHEN BAR SELECT IS ON FIRST INDEX
            if(collider <= collisionIndex) {
                if(mouseDirection === "right") {
                    elements.forEach((el, index) => {
                        if(index >= collisionIndex && index < collisionIndex + 1 && el != dragBar) {
                            el.style.transform = `translateX(-${barDimension}px)`;
                        }
                    });
                } else {
                    elements.forEach((el, index) => {
                        if(index - 1 >= collisionIndex) {
                            el.style.transform = `translateX(0px)`;
                        }
                    })
                }
            }
        }

        this.dragEvent = {
            posInit,
            currentMousePos,
            beforeMousePos: currentMousePos,
            mouseDirection,
            flagPos,
            collisionList,
            collisionIndex,
            collider,
            elements
        }
    }

}

export const Events = new events()
