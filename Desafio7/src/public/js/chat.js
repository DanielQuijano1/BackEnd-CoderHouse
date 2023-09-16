const socket = io();

let user;
const chatbox = document.getElementById(`chatbox`);

Swal.fire({
    title: "Bienvenido!, por favor ingresa tu e-mail",
    input: "email",
    allowOutsideClick: false,
}).then((result) => {
    user = result.value;
    socket.emit("authenticated", user);
});

chatbox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if (chatbox.value.trim().length > 0) {
            socket.emit("message", { user: user, message: chatbox.value });
            chatbox.value = "";
        }
    }
});

socket.on("messageLogs", (data) => {
    console.log("🚀 ~ file: chat.js:29 ~ socket.on ~ data:", data);
    if (!user) return;
    const log = document.getElementById("messageLogs");
    //let messages = "";
    log.innerHTML = "";
    for (const msg of data) {
        log.innerHTML +=
            `<div class="container">
            <div class="collection-list mt-4 row gx-0 gy-3" >
            <div class="card " >
            <p class="mx-3 mt-2"><b>Usuario:</b> ${msg.user}</p>
            <p class="mx-3"><b>Mensaje:</b> ${msg.message}</p>
            <p class="mx-3"><b>Enviado:</b> ${msg.postTime}</p>
            </div>
            </div>
            </div>
            `
    }
    // data.forEach((msg) => {
    //   messages += `${msg.user} dice: ${msg.message}</br>`;
    // });
    // log.innerHTML = messages;
});

socket.on("newUserConected", (data) => {
    if (!user) return;
    swal.fire({
        title: `${data} ha iniciado sesion`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
    });
});