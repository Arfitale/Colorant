import {user} from "./modules/app.js";
import {eventHandler} from "./modules/eventHandler.js";

const nav = document.querySelector(".nav");
const navMain = nav.querySelector(".nav-main");
const navLinks = navMain.querySelector(".nav-links");
const signLinks = navMain.querySelector(".sign");
const account = nav.querySelector(".account");


_init();

// EVENT
window.addEventListener("click", event => {
    const target = event.target;

    // menu btn
    if(target.classList.contains("btn-menu") || target.classList.contains("btn-close-nav")) {
        eventHandler.menuBtn_handler();
    }
});

function _init() {
    if(user.isLogin()) {
        console.log(true);
        
        // style when user already login 
        signLinks.style.display = "none";
        account.style.display = "block";

        userLoginHandle();
    } else {
        console.log(false);
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

function userLoginHandle() {
    const {username, userImage} = user.getUser();
    const accountCtr = account.querySelector(".account-ctr");
    const accountImg = account.querySelector(".account-ctr img");
    const accountDefaultImg = account.querySelector(".img-default");

    // set image profile
    if(userImage) {
        accountImg.setAttribute("src", userImage);
        accountImg.style.display = "block";
        accountDefaultImg.style.display = "none";
    } else {
        const defaultImgLetter = accountDefaultImg.querySelector("span");
        
        accountImg.style.display = "none";
        accountDefaultImg.style.display = "flex";

        accountDefaultImg.style.backgroundColor = "#157de6";
        defaultImgLetter.innerText = username[0].toUpperCase();
    }
}

