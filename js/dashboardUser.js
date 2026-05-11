const token = localStorage.getItem("token");

async function cargarDatosDashboard() {
    try {
        const response = await fetch("http://localhost:3000/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();
        const user = data.data;

        document.getElementById("nombreDashboard").textContent = user.full_name;
        document.getElementById("emailDashboard").textContent = user.email;

    } catch (error) {
        console.log(error);
    }
}

cargarDatosDashboard();