import GeneratorColor from "./generator.js";
import { ui } from "./UI.js";
import { hook } from "./hook.js";
import App from "./app.js";

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

    initEvent(target) {
        const overlay = document.querySelector(".overlay");

        // account btn
        if(target.classList.contains("account-ctr") || target.matches(".overlay.account") || target.classList.contains("btn-account-setting-close")) {
            const accountSettings = document.querySelector(".account-settings-ctr");
    
            accountSettings.classList.toggle("show");
            overlay.classList.toggle("active");
            overlay.classList.toggle("account");
        }
    
        // signout btn
        if(target.classList.contains("signout-btn") && user.isLogin()) {
            window.localStorage.removeItem("colorant_user");
            window.location.reload();
        }

        // menu btn - mobile
        if(target.classList.contains("btn-menu") || target.classList.contains("btn-close-nav")) {
            eventHandler.menuBtn_handler();
        }
    }

    menuBtn_handler() {
        const navBar = hook(".nav-main");
        const closeBtn = hook(".btn-close-nav");
        const menuBtn = hook(".btn-menu-mobile");

        navBar.classList.toggle("show");
        closeBtn.classList.toggle("active");
        menuBtn.classList.toggle("invisible");
    }

    showLoginModal() {
        const showLoginModal = document.querySelector(".ui .login-modal");

        showLoginModal.classList.toggle("d-block");
    }

    unsaveBtn_handler(saveBtn) {
        saveBtn.classList.remove("saved");
    }

    savePalleteBtn_handler(currentPallete) {
        const savePalleteModal = document.querySelector(".ui .save-pallete-modal");
        
        // Determine pallete to save
        const palleteToSave = savePalleteModal.querySelector(".pallete-to-saved");
        palleteToSave.innerHTML = "";
        for(let x = 0; x < currentPallete.length; x++) {
            const bar = document.createElement("li");
            bar.classList.add("bar");
            bar.style.backgroundColor = `#${currentPallete[x]}`;

            palleteToSave.appendChild(bar);
        }

        savePalleteModal.classList.toggle("d-flex");
    }

    bookmarkBtn_handler() {
        const bookmarkUI = hook(".bookmark", false, UI);
        const noPallete = document.querySelector(".ui .no-pallete");
        const palleteLib = document.querySelector(".ui .pallete-library");
        const {colorLibrary} = App.getUser();
        
        if(bookmarkUI.classList.contains("show")) {
            palleteLib.innerHTML = "";
        } else {
            if(colorLibrary) {
                palleteLib.classList.add("d-flex");
                noPallete.classList.add("d-none");
                
                for(let x = 0; x < colorLibrary.length; x++) {
                    const {palleteName: name, pallete: colors, palleteDescription: desc} = colorLibrary[x];
    
                    const newPallete = document.createElement("div");
                    const palleteName = document.createElement("div");
                    const palleteInterface = document.createElement("div");
                    const palleteBar = document.createElement("div");
                    const palleteTools = document.createElement("ul");
    
                    newPallete.classList.add("pallete-item");
                    palleteInterface.classList.add("pallete-interface");
                    palleteBar.classList.add("pallete-bar");
                    palleteName.classList.add("pallete-name");
                    palleteTools.classList.add("pallete-tools");
    
                    palleteName.textContent = name;
    
                    for(let y = 0; y < colors.length; y++) {
                        const bar = document.createElement("div");
    
                        bar.classList.add("bar");
                        bar.style.backgroundColor = `#${colors[y]}`;
                        palleteBar.append(bar);
                    }

                    palleteTools.innerHTML += `
                    <li>
                        <button class="btn btn-pallete-show btn-color btn-icon btn-ui" data-tippy-content="pallete option">
                            <i class="ri-refresh-line"></i>
                        </button>
                    </li>
                    <li>
                        <button class="btn btn-pallete-delete btn-color btn-icon btn-ui" data-tippy-content="pallete option">
                        <i class="ri-delete-bin-2-line"></i>
                        </button>
                    </li>`;
                    palleteInterface.append(palleteBar);
                    palleteInterface.append(palleteTools);

                    newPallete.appendChild(palleteName);
                    newPallete.appendChild(palleteInterface);
                    palleteLib.appendChild(newPallete);
                }  
            } else {
                palleteLib.classList.add("d-none");
                noPallete.classList.add("d-block");
                noPallete.innerHTML = `<div>No pallete saved</div>`;
            }
        }
        bookmarkUI.classList.toggle("show");
    }


    addBtn_handler(len) {
        const [colorName, colorCode] = GeneratorColor.getRandomColor();
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
                <div class="color-code"></div>
                <div class="color-name"></div>
            </div>`

        if(len === 2) {
            hook(".btn-remove", true, COLOR_SCHEME).forEach(btn => btn.style.display = "block");
        }

        COLOR_SCHEME.appendChild(bar);
        ui.updateColor(bar, `#${colorCode}`, colorName);

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

export const eventHandler = new events()
