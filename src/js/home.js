import {user} from "./modules/app.js";
import {eventHandler} from "./modules/eventHandler.js";

// UI
const overlay = document.querySelector(".overlay");

function _init() {
    if(user.isLogin()) {
        user.onLogin();
    } else {
        user.onLogout();
    }

    setDimension();
}

function setDimension() {
    const nav  = document.querySelector(".nav");
    const hero = document.querySelector(".hero");

    // set hero dimension
    const nav_height = nav.getBoundingClientRect().height;

    hero.style.height = `calc(100vh - ${nav_height}px)`;
}

// EVENT
document.addEventListener("DOMContentLoaded", () => {
    _init();
});

window.addEventListener("click", event => {
    const target = event.target;

    eventHandler.initEvent(target);
});