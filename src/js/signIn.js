const form = document.getElementById("form");
const email = form.elements["email"];
const password = form.elements["password"];

// EVENTS
form.addEventListener("submit", async event => {
    event.preventDefault();
    try {
        const {data} = await axios.get(`/data/user/auth/${email.value}&${password.value}`);
        const user = await data.user;
        let errorDesc = "";

        if(user) {
            window.localStorage.setItem("colorant_user", JSON.stringify(user));
            window.location.href = "../";
        } else {
            errorDesc = "user doesn't exist";
        }
    } catch (error) {
        console.log(error);
    }
})