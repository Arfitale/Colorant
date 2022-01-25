// USER
class User {
    constructor() {
        this.localStorage = window.localStorage;
    } 

    getUser() {
        const user = this.localStorage.getItem("user");
    
        return user ? JSON.parse(user) : {};
    }

    isLogin() {
        const user = this.localStorage.getItem("user");
        return user ? true : false;
    }
}

export const user = new User()