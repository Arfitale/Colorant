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

    // account bar
    if(target.classList.contains("account-ctr") || target.matches(".overlay.account")) {
        const accountSettings = target.parentElement.querySelector(".account-settings-ctr");

        accountSettings.classList.toggle("show");
        target.classList.toggle("from-overlay");

        overlay.classList.toggle("active");
        overlay.classList.toggle("account");
    }

    // signout btn
    if(target.classList.contains("signout-btn") && user.isLogin()) {
        window.localStorage.removeItem("colorant_user");
        window.location.reload()
    }

    // menu btn
    if(target.classList.contains("btn-menu") || target.classList.contains("btn-close-nav")) {
        eventHandler.menuBtn_handler();
    }
});