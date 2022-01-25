import {user} from "./modules/app.js";
import {eventHandler} from "./modules/eventHandler.js";


// EVENT
document.addEventListener("DOMContentLoaded", () => {
    _init();
});

window.addEventListener("click", event => {
    const target = event.target;

    // menu btn
    if(target.classList.contains("btn-menu") || target.classList.contains("btn-close-nav")) {
        eventHandler.menuBtn_handler();
    }
});

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