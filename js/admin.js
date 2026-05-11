const token = localStorage.getItem("token");

const tabla = document.getElementById("tablaUsuarios");

async function cargarUsuarios() {

    try {

        const response = await fetch("http://localhost:3000/api/users", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);
        
        tabla.innerHTML = "";

        data.data.forEach(user => {

            let colorRol = "#1565c0";

            if (user.role === "admin") {
                colorRol = "#a30000";
            }

            if (user.role === "coach") {
                colorRol = "#2e7d32";
            }

            tabla.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.full_name}</td>
                    <td>${user.email}</td>

                    <td>
                        <span style="
                            background:${colorRol};
                            color:white;
                            padding:5px 10px;
                            border-radius:8px;
                        ">
                            ${user.role}
                        </span>
                    </td>
                    
                    <td>
                        ${user.birth_date
                            ? user.birth_date.split("-").reverse().join("/")
                            : "--/--/----"}
                    </td>

                    <td>
                        ${user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "--/--/----"}
                    </td>

                    <td>
                        <button 
                            class="btn-editar"
                            onclick="editarUsuario(${user.id})"
                        >
                            ✏️ Editar
                        </button>

                        <button 
                            class="btn-eliminar"
                            onclick="eliminarUsuario(${user.id})"
                        >
                            🗑 Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {

        console.log(error);

    }

}

cargarUsuarios();

const form = document.getElementById("userForm");
const mensaje = document.querySelector(".mensaje");
let usuarioEditando = null;

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const rol = document.getElementById("rol").value;
    const fecha = document.getElementById("fecha").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;



    // VALIDACIONES

    if (!nombre || !email) {
    
        mensaje.textContent = "Nombre y email son obligatorios";
        mensaje.style.color = "red";
        return;
    }

// SOLO exigir contraseña al CREAR

    if (usuarioEditando === null) {
    
        if (!password || !password2) {

            mensaje.textContent = "Debe ingresar contraseña";
            mensaje.style.color = "red";
            return;

        }

    }

// Validar largo SOLO si escribió contraseña

    if (password && password.length < 8) {

        mensaje.textContent = "La contraseña debe tener mínimo 8 caracteres";
        mensaje.style.color = "red";
        return;

    }

    // Validar coincidencia SOLO si escribió contraseña

    if (password && password !== password2) {

        mensaje.textContent = "Las contraseñas no coinciden";
        mensaje.style.color = "red";
        return;

    }

    try {
    
        let url = "http://localhost:3000/api/users";
        let metodo = "POST";
    
        if (usuarioEditando !== null) {
    
            url = `http://localhost:3000/api/users/${usuarioEditando}`;
            metodo = "PUT";
    
        }
    
        const response = await fetch(url, {
    
            method: metodo,
    
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
    
            body: JSON.stringify({
                full_name: nombre,
                email: email,
                ...(password && { password }),
                role: rol,
                birth_date: fecha
            })
    
        });
    
        const data = await response.json();
    
        if (response.ok) {
    
            mensaje.textContent = usuarioEditando !== null
                ? "Usuario actualizado correctamente"
                : "Usuario creado correctamente";
    
            mensaje.style.color = "green";
    
            form.reset();
    
            usuarioEditando = null;
    
            document.querySelector(".btn-pequeno").textContent = "Crear Usuario";
    
            document.getElementById("tituloFormulario").textContent = "Nuevo Usuario";
    
            cargarUsuarios();
    
        } else {
    
            mensaje.textContent = data.message || "Error";
            mensaje.style.color = "red";
    
        }
    
    } catch (error) {
    
        mensaje.textContent = "Error del servidor";
        mensaje.style.color = "red";
    
        console.log(error);
    
    }

});

async function eliminarUsuario(id) {

    const confirmar = confirm("¿Eliminar usuario?");

    if (!confirmar) {
        return;
    }

    try {

        const response = await fetch(`http://localhost:3000/api/users/${id}`, {

            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        if (response.ok) {

            cargarUsuarios();

        } else {

            console.log("Error al eliminar");

        }

    } catch (error) {

        console.log(error);

    }

}

async function editarUsuario(id) {

    try {

        const response = await fetch(`http://localhost:3000/api/users/${id}`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        const user = data.data;

        document.getElementById("nombre").value = user.full_name;
        document.getElementById("email").value = user.email;
        document.getElementById("rol").value = user.role;
        document.getElementById("password").value = "";
        document.getElementById("password2").value = "";

        if (user.birth_date) {
            document.getElementById("fecha").value = user.birth_date;
        }

        document.getElementById("tituloFormulario").textContent = "Editar Usuario";
        
        usuarioEditando = id;

        document.querySelector(".btn-pequeno").textContent = "Guardar cambios";

    } catch (error) {

        console.log(error);

    }

}