// Funciones para mostrar/ocultar modales
function mostrarLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function mostrarRegistro() {
    document.getElementById('registroModal').style.display = 'block';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Función para manejar el login
function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Verificar credenciales en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        window.location.href = 'hombres.html';
    } else {
        alert('Credenciales incorrectas');
    }
}

// Función para manejar el registro
function registrar(event) {
    event.preventDefault();
    const nombre = document.getElementById('regNombre').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    // Guardar usuario en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (usuarios.some(u => u.email === email)) {
        alert('Este email ya está registrado');
        return false;
    }

    usuarios.push({ nombre, email, password });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert('Registro exitoso');
    cerrarModal('registroModal');
    mostrarLogin();
    return false;
}

// Cerrar modales al hacer click fuera
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
} 