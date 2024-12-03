let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let carritoVisible = false;
let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

// Array de imágenes de superhéroes
const superheroImages = [
    'https://i.imgur.com/keVWKuw.png', // Spider-Man
    'https://i.imgur.com/v3OXmAp.png', // Iron Man
    'https://i.imgur.com/LhPkB3T.png', // Captain America
    'https://i.imgur.com/VW5YVYA.png', // Thor
    'https://i.imgur.com/R0kCKvW.png', // Hulk
    'https://i.imgur.com/1J8kEhN.png'  // Batman
];

// Función para cargar imágenes de superhéroes
function cargarImagenSuperheroe() {
    const randomIndex = Math.floor(Math.random() * superheroImages.length);
    const imageUrl = superheroImages[randomIndex];
    actualizarBannerNinos(imageUrl);
}

// Función para actualizar el banner
function actualizarBannerNinos(imageUrl) {
    const bannerNinos = document.querySelector('.banner-ninos');
    if (bannerNinos) {
        bannerNinos.style.cssText = `
            background: linear-gradient(45deg, rgba(76, 175, 80, 0.8), rgba(56, 142, 60, 0.8)),
                        url('${imageUrl}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            transition: background-image 0.5s ease;
        `;
    }
}

// Modificar la función actualizarCarrito para manejar errores
function actualizarCarrito() {
    try {
        const itemsCarrito = document.getElementById('items-carrito');
        const contadorCarrito = document.getElementById('contador-carrito');
        const totalCarrito = document.getElementById('total-carrito');
        
        if (!itemsCarrito || !contadorCarrito || !totalCarrito) {
            console.warn('Elementos del carrito no encontrados');
            return;
        }

        itemsCarrito.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-carrito';
            itemElement.innerHTML = `
                <span>${item.nombre} (${item.cantidad})</span>
                <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                <button class="eliminar-item" onclick="eliminarDelCarrito('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            itemsCarrito.appendChild(itemElement);
            total += item.precio * item.cantidad;
        });

        contadorCarrito.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        totalCarrito.textContent = total.toFixed(2);
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
    }
}

function eliminarDelCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
        } else {
            carrito.splice(index, 1);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
        mostrarNotificacion('Producto eliminado del carrito');
    }
}

function vaciarCarrito() {
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    mostrarNotificacion('Carrito vaciado');
}

function toggleCarrito() {
    const panel = document.getElementById('carrito-panel');
    const productosContainer = document.querySelector('.productos-container');
    carritoVisible = !carritoVisible;
    
    if (carritoVisible) {
        panel.classList.add('activo');
        productosContainer.classList.add('carrito-abierto');
    } else {
        panel.classList.remove('activo');
        productosContainer.classList.remove('carrito-abierto');
    }
}

function cerrarCarrito() {
    carritoVisible = false;
    const panel = document.getElementById('carrito-panel');
    const productosContainer = document.querySelector('.productos-container');
    panel.classList.remove('activo');
    productosContainer.classList.remove('carrito-abierto');
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById('notificacion');
    const mensajeNotificacion = document.getElementById('mensaje-notificacion');
    
    mensajeNotificacion.textContent = mensaje;
    notificacion.classList.add('mostrar');
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 2000);
}

function iniciarCheckout() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'error');
        return;
    }

    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutContent = document.getElementById('checkout-content');

    if (!usuarioActual) {
        // Mostrar formulario de login/registro
        checkoutContent.innerHTML = `
            <div class="auth-section">
                <h3>Para continuar, necesitas iniciar sesión</h3>
                <div class="auth-options">
                    <button onclick="mostrarLoginCheckout()">Iniciar Sesión</button>
                    <button onclick="mostrarRegistroCheckout()">Registrarse</button>
                </div>
            </div>
        `;
    } else {
        // Mostrar opciones de pago
        mostrarOpcionesPago();
    }

    checkoutModal.style.display = 'block';
}

function mostrarLoginCheckout() {
    document.getElementById('checkout-content').innerHTML = `
        <form id="login-form" onsubmit="return loginUsuario(event)">
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="loginEmail" required>
            </div>
            <div class="form-group">
                <label>Contraseña:</label>
                <input type="password" id="loginPassword" required>
            </div>
            <button type="submit">Iniciar Sesión</button>
        </form>
    `;
}

function mostrarRegistroCheckout() {
    document.getElementById('checkout-content').innerHTML = `
        <form id="registro-form" onsubmit="return registrarUsuario(event)">
            <div class="form-group">
                <label>Nombre:</label>
                <input type="text" id="regNombre" required>
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="regEmail" required>
            </div>
            <div class="form-group">
                <label>Contraseña:</label>
                <input type="password" id="regPassword" required>
            </div>
            <button type="submit">Registrarse</button>
        </form>
    `;
}

function mostrarOpcionesPago() {
    document.getElementById('checkout-content').innerHTML = `
        <div class="payment-section">
            <h3>Seleccione método de pago</h3>
            <div class="payment-options">
                <button onclick="seleccionarPago('efectivo')" class="payment-btn">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>Efectivo</span>
                </button>
                <button onclick="seleccionarPago('tarjeta')" class="payment-btn">
                    <i class="fas fa-credit-card"></i>
                    <span>Tarjeta</span>
                </button>
            </div>
        </div>
    `;
}

function seleccionarPago(metodo) {
    const checkoutContent = document.getElementById('checkout-content');
    
    if (metodo === 'efectivo') {
        checkoutContent.innerHTML = `
            <div class="payment-form">
                <h3>Pago en Efectivo</h3>
                <p>Total a pagar: $${document.getElementById('total-carrito').textContent}</p>
                <form onsubmit="return procesarPagoEfectivo(event)">
                    <div class="form-group">
                        <label>Nombre completo:</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>DNI:</label>
                        <input type="text" required>
                    </div>
                    <button type="submit">Confirmar Pago</button>
                </form>
            </div>
        `;
    } else {
        checkoutContent.innerHTML = `
            <div class="payment-form">
                <h3>Pago con Tarjeta</h3>
                <form onsubmit="return procesarPagoTarjeta(event)">
                    <div class="form-group">
                        <label>Número de tarjeta:</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Nombre en la tarjeta:</label>
                        <input type="text" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Vencimiento:</label>
                            <input type="text" placeholder="MM/AA" required>
                        </div>
                        <div class="form-group">
                            <label>CVV:</label>
                            <input type="text" required>
                        </div>
                    </div>
                    <button type="submit">Pagar $${document.getElementById('total-carrito').textContent}</button>
                </form>
            </div>
        `;
    }
}

function procesarPagoEfectivo(event) {
    event.preventDefault();
    finalizarCompra('efectivo');
    return false;
}

function procesarPagoTarjeta(event) {
    event.preventDefault();
    finalizarCompra('tarjeta');
    return false;
}

function finalizarCompra(metodoPago) {
    mostrarNotificacion('Procesando pago...', 'info');
    
    setTimeout(() => {
        const ordenId = 'ORD-' + Date.now();
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
        
        // Cerrar ambos modales
        document.getElementById('checkoutModal').style.display = 'none';
        cerrarCarrito();
        
        mostrarNotificacion(`¡Compra exitosa! Orden #${ordenId}`, 'success');
    }, 2000);
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function loginUsuario(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        usuarioActual = usuario;
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        mostrarOpcionesPago();
    } else {
        alert('Credenciales incorrectas');
    }
    return false;
}

function registrarUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById('regNombre').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (usuarios.some(u => u.email === email)) {
        alert('Este email ya está registrado');
        return false;
    }

    const nuevoUsuario = { nombre, email, password };
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    usuarioActual = nuevoUsuario;
    localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));
    
    mostrarOpcionesPago();
    return false;
}

function agregarAlCarrito(e) {
    const button = e.target;
    const producto = button.closest('.producto');
    const id = button.dataset.id;
    const nombre = producto.querySelector('h3').textContent;
    const precio = parseFloat(button.dataset.precio);

    // Buscar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar carrito
    actualizarCarrito();

    // Mostrar notificación
    mostrarNotificacion(`${nombre} agregado al carrito`);

    // Mostrar el carrito
    if (!carritoVisible) {
        toggleCarrito();
    }
}

// Función para duplicar los elementos del carrusel
function duplicateCarouselItems() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const slides = document.querySelectorAll('.carousel-slide');
    
    // Duplicar las diapositivas para crear un loop infinito
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
    });
}

// Funciones para editar contacto
function mostrarEditarContacto() {
    const modal = document.getElementById('editContactModal');
    const emailInput = document.getElementById('editEmail');
    const phoneInput = document.getElementById('editPhone');
    
    // Cargar datos actuales
    const currentEmail = document.getElementById('contact-email').textContent.split(': ')[1];
    const currentPhone = document.getElementById('contact-phone').textContent.split(': ')[1];
    
    emailInput.value = currentEmail;
    phoneInput.value = currentPhone;
    
    modal.style.display = 'block';
}

function actualizarContacto(event) {
    event.preventDefault();
    
    const newEmail = document.getElementById('editEmail').value;
    const newPhone = document.getElementById('editPhone').value;
    
    // Actualizar en todos los footers de la página
    const emailElements = document.querySelectorAll('#contact-email');
    const phoneElements = document.querySelectorAll('#contact-phone');
    
    emailElements.forEach(el => el.textContent = `Contacto: ${newEmail}`);
    phoneElements.forEach(el => el.textContent = `Tel: ${newPhone}`);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('contactEmail', newEmail);
    localStorage.setItem('contactPhone', newPhone);
    
    // Cerrar modal y mostrar notificación
    cerrarModal('editContactModal');
    mostrarNotificacion('Información de contacto actualizada');
    
    return false;
}

// Cargar datos guardados al iniciar
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado');
    
    // Cargar carrito desde localStorage
    actualizarCarrito();

    // Evento para mostrar/ocultar carrito
    const carritoIcon = document.querySelector('.carrito-icon');
    if (carritoIcon) {
        carritoIcon.addEventListener('click', toggleCarrito);
    }
    
    // Eventos para botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    if (botonesAgregar.length > 0) {
        botonesAgregar.forEach(button => {
            button.addEventListener('click', agregarAlCarrito);
        });
    }

    // Evento para vaciar carrito
    const botonVaciar = document.getElementById('vaciar-carrito');
    if (botonVaciar) {
        botonVaciar.addEventListener('click', vaciarCarrito);
    }

    // Evento para cerrar carrito
    const botonCerrar = document.getElementById('cerrar-carrito');
    if (botonCerrar) {
        botonCerrar.addEventListener('click', cerrarCarrito);
    }

    // Evento para finalizar compra
    const botonFinalizar = document.getElementById('finalizar-compra');
    if (botonFinalizar) {
        botonFinalizar.addEventListener('click', iniciarCheckout);
    }

    // Inicializar banner de niños si estamos en esa página
    const isNinosPage = window.location.pathname.includes('ninos.html');
    if (isNinosPage) {
        cargarImagenSuperheroe();
        setInterval(cargarImagenSuperheroe, 5000);
    }

    // Inicializar carrusel
    duplicateCarouselItems();

    // Cargar datos de contacto guardados
    const savedEmail = localStorage.getItem('contactEmail');
    const savedPhone = localStorage.getItem('contactPhone');
    
    if (savedEmail) {
        document.querySelectorAll('#contact-email').forEach(el => 
            el.textContent = `Contacto: ${savedEmail}`);
    }
    if (savedPhone) {
        document.querySelectorAll('#contact-phone').forEach(el => 
            el.textContent = `Tel: ${savedPhone}`);
    }
}); 