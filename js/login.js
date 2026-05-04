const form = document.querySelector("form");
const mensaje = document.querySelector(".mensaje");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.ok) {
            // guardar datos
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user));

            const role = data.data.user.role;

            // redirección
            if (role === "user") {
                window.location.href = "dashboard-user.html";
            } else if (role === "coach") {
                window.location.href = "dashboard-coach.html";
            } else if (role === "admin") {
                window.location.href = "dashboard-admin.html";
            }

        } else {
            mensaje.textContent = data.message;
            mensaje.style.color = "red";
        }

    } catch (error) {
        mensaje.textContent = "Error al conectar con el servidor";
        mensaje.style.color = "red";
    }
});