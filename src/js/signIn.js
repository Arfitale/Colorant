const form = document.getElementById("form");
const email = form.elements["email"];
const password = form.elements["password"];

// EVENTS
form.addEventListener("submit", async event => {
    event.preventDefault();
    try {
        const {data} = await axios.get(`/data/user/${email.value}`);
        if(data) {
            const user = data.user;
            const passDB = user.password;

            if(password.value === passDB) {
                window.localStorage.setItem("colorant_user", JSON.stringify(user));
                window.location.href = "../";
            } else {
                console.log("password is incorrect");
            }
        }
    } catch (error) {
        console.log(error);
    }
})