// USER
class User {
    constructor() {
        this.localStorage = window.localStorage;
        this.nav = document.querySelector(".nav");
        this.navMain = this.nav.querySelector(".nav-main");
        this.signLinks = this.navMain.querySelector(".sign");
        this.account = this.nav.querySelector(".account");
    }

    onLogin() {
        // style when user already login 
        this.signLinks.style.display = "none";
        this.account.style.display = "flex";

        // handle UI
        this.userLoginHandler();
    }

    onLogout() {
        this.signLinks.style.display = "flex";
        this.account.style.display = "none";
    }

    getUser() {
        const user = this.localStorage.getItem("user");
        return user ? JSON.parse(user) : {};
    }

    isLogin() {
        const user = this.localStorage.getItem("user");
        return user ? true : false;
    }

    userLoginHandler() {
        const nav = document.querySelector(".nav");
        const account = nav.querySelector(".account");
        
        const {username, userImage} = this.getUser();
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
}

export const user = new User()