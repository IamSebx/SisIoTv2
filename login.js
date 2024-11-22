// Credenciales de ejemplo
const correctUsername = "admin";
const correctPassword = "admin";

// Obtener el formulario y el elemento de mensaje de error
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario
    
    // Obtener los valores de usuario y contraseña
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Comprobación para ver si los campos están completos
    if (!username || !password) {
        errorMessage.textContent = "Todos los campos son obligatorios.";
        console.log("Campos obligatorios no llenados"); // Mensaje de depuración
        return;
    }

    // Verificar credenciales
    if (username === correctUsername && password === correctPassword) {
        console.log("Credenciales correctas"); // Mensaje de depuración
        // Redirigir a la nueva interfaz
        window.location.href = "Interfaz-1.html"
    } else {
        // Mostrar mensaje de error
        errorMessage.textContent = "Usuario o contraseña incorrectos. Intenta de nuevo.";
        console.log("Credenciales incorrectas"); // Mensaje de depuración
    }
});
