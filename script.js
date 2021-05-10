
const socket = io("https://chatapp99.netlify.app/");
const messageBody = document.getElementById("message-body");
const messageForm = document.getElementById("message-form");
const input = messageForm.querySelector("input");

const nameForm = document.getElementById("name-form");
const nameContainer = document.getElementById("name-container");
const logout = document.getElementById("logout");

nameForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const nameInput = nameForm.querySelector("div").querySelector("input");
    document.body.removeChild(nameContainer);
    logout.style.display = "flex";

    const userName = nameInput.value;

    socket.emit("loggedIn", userName);

    appendMesg("you logged in", "user-status");

    socket.on("newUser", (user)=>{
        appendMesg(`${user} logged in`, "user-status");
    });

    socket.on("message-received", ({msg, userName})=>{
        appendMesg("< "+userName+" >" + " \n \n" + msg, "message");
    })

    messageForm.addEventListener("submit", (e)=>{
        e.preventDefault();

        socket.emit("message-sent", input.value);

        appendMesg(input.value, "your-message");

        input.value = "";
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    });

    socket.on("loggedOut", (userName)=>{
        appendMesg(userName + " left", "user-status");
    });

    logout.addEventListener("click", ()=>{
        let result = confirm("Are you sure ?");

        if(result) {
            window.location = "/";
        }
    })


    function appendMesg(data, cls) {
        let elem = document.createElement("div");
        elem.innerText = data;
        elem.className = cls;
        messageBody.appendChild(elem);
    }
})
