const token = localStorage.getItem("token");

// ELEMENTOS

const perfilNombre = document.getElementById("perfilNombre");
const perfilEmail = document.getElementById("perfilEmail");
const perfilRol = document.getElementById("perfilRol");
const perfilFecha = document.getElementById("perfilFecha");
const perfilRegistro = document.getElementById("perfilRegistro");

const inputNombre = document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const inputFecha = document.getElementById("fecha");


// CARGAR PERFIL

async function cargarPerfil() {

    try {

        const response = await fetch("http://localhost:3000/api/auth/me", {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        const user = data.data;
        const volverDashboard = document.getElementById("volverDashboard");

        if (user.role === "admin") {
            volverDashboard.href = "dashboard-admin.html";
        } else if (user.role === "coach") {
            volverDashboard.href = "dashboard-coach.html";
        } else {
            volverDashboard.href = "dashboard-user.html";
        }

// CAMBIAR COLOR SEGUN ROL

        document.body.classList.remove("admin", "coach", "user");

        document.body.classList.add(user.role);

        console.log(user);

        // CARD

        perfilNombre.textContent = user.full_name;
        perfilEmail.textContent = user.email;

        perfilRol.textContent = user.role;

        // COLORES ROL

        if (user.role === "admin") {
            perfilRol.style.background = "#a30000";
        }

        if (user.role === "coach") {
            perfilRol.style.background = "#2e7d32";
        }

        if (user.role === "user") {
            perfilRol.style.background = "#1565c0";
        }

        // FECHA

        if (user.birth_date) {
        
            const fechaNacimiento =
                user.birth_date.split("T")[0];
        
            perfilFecha.textContent =
                fechaNacimiento
                .split("-")
                .reverse()
                .join("/");
        
            inputFecha.value = fechaNacimiento;
        
        }

        // FECHA REGISTRO

        if (user.created_at) {
        
            const registro = new Date(user.created_at);
        
            perfilRegistro.textContent =
                registro.toLocaleDateString();
        
        }

        // FORM

        inputNombre.value = user.full_name;
        inputEmail.value = user.email;

    } catch (error) {

        console.log(error);

    }

}

cargarPerfil();

const perfilForm = document.getElementById("perfilForm");
const mensaje = document.querySelector(".mensaje");

perfilForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const fecha = inputFecha.value;

    if (!nombre) {

        mensaje.textContent = "El nombre es obligatorio";
        mensaje.style.color = "red";
        return;

    }

    try {

        const response = await fetch("http://localhost:3000/api/auth/me", {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                full_name: nombre,
                birth_date: fecha
            })

        });

        const data = await response.json();

        if (response.ok) {

            mensaje.textContent =
                "Perfil actualizado correctamente";

            mensaje.style.color = "green";

            cargarPerfil();

        } else {

            mensaje.textContent =
                data.message || "Error al actualizar";

            mensaje.style.color = "red";

        }

    } catch (error) {

        console.log(error);

    }

});

const passwordForm = document.getElementById("passwordForm");
const mensajePassword = document.querySelector(".mensajePassword");

passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const currentPassword =
        document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        mensajePassword.textContent = "Debe completar ambas contraseñas";
        mensajePassword.style.color = "red";
        return;
    }

    if (newPassword.length < 8) {
        mensajePassword.textContent = "La contraseña debe tener mínimo 8 caracteres";
        mensajePassword.style.color = "red";
        return;
    }

    if (newPassword !== confirmPassword) {
        mensajePassword.textContent = "Las contraseñas no coinciden";
        mensajePassword.style.color = "red";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/auth/me/password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            mensajePassword.textContent = "Contraseña actualizada correctamente";
            mensajePassword.style.color = "green";
            passwordForm.reset();
        } else {
            mensajePassword.textContent = data.message || "Error al cambiar contraseña";
            mensajePassword.style.color = "red";
        }

    } catch (error) {
        mensajePassword.textContent = "Error del servidor";
        mensajePassword.style.color = "red";
        console.log(error);
    }
});