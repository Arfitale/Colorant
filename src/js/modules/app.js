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
        const noPallete = document.querySelector(".ui .no-pallete");
        
        let {username, avatar, colorLibrary} = this.getUser();
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
            // pass
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

    userLoginHandler_generatorApp() {
        this.userLoginHandler();
        // Check colorLibrary existance
        if(!colorLibrary) {
            colorLibrary = {};
        }

        // set colorLibrary
        if(Object.keys(colorLibrary).length) {
            const palleteDOM = document.querySelector(".ui .pallete-library");

            noPallete.classList.add("d-none");
            palleteDOM.classList.add("d-flex");

            for(let x = 0; x < colorLibrary.length; x++) {
                const palletes = colorLibrary[x].pallete;
                const palleteItem = document.createElement("div");

                const palleteName = document.createElement("div");
                const palleteInterface = document.createElement("div");
                const palleteBar = document.createElement("div");

                palleteItem.classList.add("pallete-item");
                palleteInterface.classList.add("pallete-interface");
                palleteBar.classList.add("pallete-bar");
                palleteName.classList.add("pallete-name");
                
                palleteName.textContent = colorLibrary[x].name;

                for(let y = 0; y < palletes.length; y++) {
                    const bar = document.createElement("div");
                    bar.classList.add("bar");
                    bar.style.backgroundColor = palletes[y];

                    palleteBar.append(bar);
                }

                palleteInterface.append(palleteBar);
                palleteInterface.innerHTML += `
                <button class="btn btn-pallete-more btn-color btn-ui" data-tippy-content="pallete option">
                <i class="ri-more-2-fill"></i>
                </button>`;
                
                palleteItem.appendChild(palleteName);
                palleteItem.appendChild(palleteInterface);
                palleteDOM.appendChild(palleteItem);
            }
        } else {
            noPallete.textContent = "No palettes saved yet"
        }
    }
}

export const user = new User()