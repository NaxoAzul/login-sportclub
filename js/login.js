const users = [
    { user: "user1@sportclub.cl", password: "1234", role: "usuario" },
    { user: "coach1@sportclub.cl", password: "1234", role: "coach" },
    { user: "admin1@sportclub.cl", password: "1234", role: "admin" }
];

const form = document.querySelector("form");
const mensaje = document.querySelector(".mensaje");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const usuario = users.find(u => u.user === email && u.password === password);

    if (usuario) {
        localStorage.setItem("user", JSON.stringify(usuario));

        if (usuario.role === "usuario") {
            window.location.href = "dashboard-user.html";
        } else if (usuario.role === "coach") {
            window.location.href = "dashboard-coach.html";
        } else if (usuario.role === "admin") {
            window.location.href = "dashboard-admin.html";
        }

    } else {
        mensaje.textContent = "Correo o contraseña incorrectos";
        mensaje.style.color = "red";
    }
});