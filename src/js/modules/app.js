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
        const user = this.localStorage.getItem("colorant_user");
        return user ? JSON.parse(user) : {};
    }

    isLogin() {
        const user = this.localStorage.getItem("colorant_user");
        return user ? true : false;
    }

    userLoginHandler() {
        const nav = document.querySelector(".nav");
        const account = nav.querySelector(".account");
        
        const {username, avatar} = this.getUser();
        const accountImgs = account.querySelectorAll(".account-img-ctr");

        // set image profile
        if(avatar) {
            for(let x = 0; x < accountImgs.length; x++) {
                const accountImg = accountImgs[x];
                const userImage = document.createElement("div");
                const img = document.createElement("img");
                
                userImage.classList.add("img-user");
                userImage.classList.add("avatar");
                img.setAttribute("src", avatar);
                img.style.display = "block";
    
                userImage.appendChild(img);
                
                accountImg.append(userImage);
            }
        } else {
            for(let x = 0; x < accountImgs.length; x++) {
                const accountImg = accountImgs[x];
                const defaultImg = document.createElement("div");
                const defaultLetter = document.createElement("span");
    
                // style default image
                defaultImg.classList.add("img-default");
                defaultImg.classList.add("avatar");
                defaultImg.style.display = "flex";
                defaultImg.style.backgroundColor = "#157de6";
                
                // style letter img
                defaultLetter.innerText = username[0].toUpperCase();
    
                defaultImg.appendChild(defaultLetter);
                accountImg.append(defaultImg);
            }
        }

        // set username
        const accountNameDOM = document.querySelectorAll(".account-name");
        for(let x = 0; x < accountNameDOM.length; x++) {
            accountNameDOM[x].innerText = username;
        }
    }
}

export const user = new User()