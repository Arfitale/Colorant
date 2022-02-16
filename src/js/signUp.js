const actionUrl = "/signup";
const form = document.getElementById("form");
const usernameIn = form.elements["username"];
const usernameSignal = form.querySelector("[data-signal='username-form-signal']");
const emailIn = form.elements["email"];
const emailSignal = form.querySelector("[data-signal='email-form-signal']");
const passwordIn = form.elements["password"];
const passwordSignal = form.querySelector("[data-signal='password-form-signal']");
const submitBtn = document.querySelector(".submit-btn");


// ACCOUNT CHECKER
async function isAccountAlreadyExist(email) {
    const response = await axios.get(`/data/${email}`);
    const {data} = await response;
    const {users} = data;

    for(let x = 0; x < users.length; x++) {
        if(users[x].email === email) {
            return true;
        }
    }
    return false;
}

// Form Events
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const validationError = form.querySelectorAll(".fail");

    if(validationError.length === 0) {
        const username = usernameIn.value;
        const email = emailIn.value;
        const password = passwordIn.value;
        const postData = {username, email, password};

        // CHECK IF ACCOUNT IS ALREADY REGISTERED
        if(await isAccountAlreadyExist(email)) {
            emailSignal.classList.add("fail");
            emailSignal.querySelector("span").textContent = "email is already registered";
            return;
        }else {
            try {
                const {data} = await axios.post("/register", postData);
    
                if(data.success) {
                    const localStorage = window.localStorage
                    localStorage.setItem("colorant_user", JSON.stringify(data.formData));
    
                    // Redirect to homepage with login state
                    window.location.href = "../"
                }
    
            } catch (error) {
                console.log(error);
            }
        }
        

    }
})

// Form validator events
usernameIn.addEventListener("input", event => {
    const target = event.target;
    const val = target.value;
    const validInfo = usernameSignal.querySelector("span");

    if(val === "") {
        usernameSignal.classList.add("fail");
        return validInfo.textContent = "please fill in your password";
    } else {
        let error = "";

        // validation test
        if(!/^[a-zA-Z]+.+$/.test(val)) {
            error = "Username must start with letter";
        } else if(!/^[\w\W\d]{3,}$/.test(val)) {
            error = "Username must contains 3 or more characters";
        } else if(!/^[\w\W\d]{3,16}$/.test(val)) {
            error = "Username must be less than 16 characters";
        } else if(!/^[\w\d]+$/.test(val)) {
            error = "Username must not contains any symbol or special characters";
        }

        if(error) {
            usernameSignal.classList.add("fail");
            return validInfo.textContent = error;
        } else {
            usernameSignal.classList.remove("fail");
            return validInfo.textContent = "";
        }
    }
});

emailIn.addEventListener("input", event => {
    const target = event.target;
    const val = target.value;
    const validInfo = emailSignal.querySelector("span");

    if(val === "") {
        emailSignal.classList.add("fail");
        return validInfo.textContent = "please fill in your password";
    } else {
        let error = "";

        // validation test
        if(!/^([\w\d]{3,50})@([a-z-]{3,})[.]{1,}([a-z]{2,})$/.test(val)) {
            error = "Please fill in the email field correctly";
        }

        if(error) {
            emailSignal.classList.add("fail");
            return validInfo.textContent = error;
        } else {
            emailSignal.classList.remove("fail");
            return validInfo.textContent = "";
        }
    }
});

passwordIn.addEventListener("input", event => {
    const target = event.target;
    const val = target.value;
    const validInfo = passwordSignal.querySelector("span");

    if(val === "") {
        passwordSignal.classList.add("fail");
        return validInfo.textContent = "please fill in your password";
    } else {
        let error = "";
        if(!/^[\w\W\d]{6,}$/.test(val)) {
            error = "password must contains 6+ characters";
        } else if(!/^[\w\W\d]{6,16}$/.test(val)) {
            error = "Password must be less than 16 characters";
        } else if(!val.match(/[\w]+/) || !val.match(/[\d]+/)) {
            error = "password must contains letter and number";
        } else if(!val.match(/[A-Z]/)) {
            error = "password contain at least one capital letter";
        } else if(val.match(/[\W]/)) {
            error = "password must not contains any special letter";
        }

        if(error) {
            passwordSignal.classList.add("fail");
            return validInfo.textContent = error;
        } else {
            passwordSignal.classList.remove("fail");
            return validInfo.textContent = "";
        }
    }

});