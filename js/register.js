const form = document.getElementById("registerForm");
const mensaje = document.querySelector(".mensaje");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const birth_date = document.getElementById("birth_date").value;

    //  VALIDACIONES

    // campos obligatorios
    if (!nombre || !email || !password || !password2) {
        mensaje.textContent = "Todos los campos son obligatorios";
        mensaje.style.color = "red";
        return;
    }

    // email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mensaje.textContent = "Email no válido";
        mensaje.style.color = "red";
        return;
    }

    // mínimo 8 caracteres
    if (password.length < 8) {
        mensaje.textContent = "La contraseña debe tener mínimo 8 caracteres";
        mensaje.style.color = "red";
        return;
    }

    // contraseña segura (letras + números)
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!passRegex.test(password)) {
        mensaje.textContent = "La contraseña debe tener letras y números";
        mensaje.style.color = "red";
        return;
    }

    // contraseñas iguales
    if (password !== password2) {
        mensaje.textContent = "Las contraseñas no coinciden";
        mensaje.style.color = "red";
        return;
    }

    //  ENVÍO AL BACKEND
    try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name: nombre,
                email: email,
                password: password,
                role: "user",
                birth_date: birth_date
            })
        });

        const data = await response.json();

        if (data.ok) {
            mensaje.textContent = "Registro exitoso 🎉";
            mensaje.style.color = "green";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } else {
            mensaje.textContent = data.message;
            mensaje.style.color = "red";
        }

    } catch (error) {
        mensaje.textContent = "Error al conectar con el servidor";
        mensaje.style.color = "red";
        console.error(error);
    }
});