let carrito = [];
let carritoVisible = false;
let productoAEliminar = null;
let tabActiva = 'hombres';

const stockProductos = {
    // Hombres
    h1: { // Ojotas Playeras
        talles: {
            '38-39': 5,
            '40-41': 8,
            '42-43': 3,
            '44-45': 4
        }
    },
    h2: { // Sandalias Comfort
        talles: {
            '38-39': 6,
            '40-41': 7,
            '42-43': 4,
            '44-45': 3
        }
    },
    h3: { // Short Deportivo
        talles: {
            'S': 10,
            'M': 15,
            'L': 8,
            'XL': 5
        }
    },
    // ... continuar con el resto de productos de hombres

    // Damas
    d1: { // Ojotas Fashion
        talles: {
            '35-36': 6,
            '37-38': 8,
            '39-40': 4,
            '41-42': 3
        }
    },
    // ... continuar con el resto de productos de damas

    // Niños
    n1: { // Ojotas Infantiles
        talles: {
            '27-28': 5,
            '29-30': 6,
            '31-32': 4,
            '33-34': 3
        }
    }
    // ... continuar con el resto de productos de niños
};

document.addEventListener('DOMContentLoaded', () => {
    // Evento para mostrar/ocultar carrito
    document.querySelector('.carrito-icon').addEventListener('click', toggleCarrito);
    
    // Eventos para botones de agregar al carrito
    document.querySelectorAll('.agregar-carrito').forEach(button => {
        button.addEventListener('click', agregarAlCarrito);
    });

    // Nuevo evento para vaciar carrito
    document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);

    // Agregar evento para cerrar carrito con el botón
    document.getElementById('cerrar-carrito').addEventListener('click', cerrarCarrito);
    
    // Agregar evento para cerrar carrito con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && carritoVisible) {
            cerrarCarrito();
        }
    });

    // Agregar evento para cerrar carrito al hacer clic fuera
    document.addEventListener('click', (e) => {
        const carrito = document.getElementById('carrito-panel');
        const carritoIcon = document.querySelector('.carrito-icon');
        
        if (carritoVisible && 
            !carrito.contains(e.target) && 
            !carritoIcon.contains(e.target)) {
            cerrarCarrito();
        }
    });

    // Eventos para el modal de confirmación
    document.getElementById('confirmar-eliminar').addEventListener('click', () => {
        if (productoAEliminar) {
            const index = carrito.findIndex(item => item.id === productoAEliminar);
            if (index !== -1) {
                const nombreProducto = carrito[index].nombre;
                carrito.splice(index, 1);
                actualizarCarrito();
                mostrarNotificacion(`${nombreProducto} eliminado del carrito`);
            }
            document.getElementById('modal-confirmacion').style.display = 'none';
            productoAEliminar = null;
        }
    });

    document.getElementById('cancelar-eliminar').addEventListener('click', () => {
        document.getElementById('modal-confirmacion').style.display = 'none';
        productoAEliminar = null;
    });

    // Cerrar modal al hacer clic fuera
    document.getElementById('modal-confirmacion').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.style.display = 'none';
            productoAEliminar = null;
        }
    });

    // Agregar manejo de pestañas
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', cambiarTab);
        console.log('Event listener agregado a:', button.dataset.tab);
    });

    

    // Recuperar la última tab seleccionada
    const ultimaTab = localStorage.getItem('ultimaTab');
    if (ultimaTab) {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${ultimaTab}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }
});

function toggleCarrito() {
    const panel = document.getElementById('carrito-panel');
    const productosContainer = document.querySelector('.productos-container');
    const nav = document.querySelector('nav');
    carritoVisible = !carritoVisible;
    
    if (carritoVisible) {
        panel.classList.add('activo');
        productosContainer.classList.add('carrito-abierto');
        nav.classList.add('carrito-abierto');
    } else {
        panel.classList.remove('activo');
        productosContainer.classList.remove('carrito-abierto');
        nav.classList.remove('carrito-abierto');
    }
}

function agregarAlCarrito(e) {
    const button = e.target;
    const id = button.dataset.id;
    const precio = parseFloat(button.dataset.precio);
    const nombre = button.parentElement.querySelector('h3').textContent;

    // Mostrar modal de selección de talle
    mostrarModalTalle(id, nombre, precio);
}

function mostrarModalTalle(id, nombre, precio) {
    const producto = stockProductos[id];
    let tallesHTML = '';
    
    for (const [talle, stock] of Object.entries(producto.talles)) {
        if (stock > 0) {
            tallesHTML += `
                <div class="opcion-talle">
                    <button class="btn-talle" data-talle="${talle}">
                        ${talle} (${stock} disponibles)
                    </button>
                </div>
            `;
        }
    }

    const modalHTML = `
        <div class="modal-contenido">
            <h3>Seleccionar Talle para ${nombre}</h3>
            <div class="talles-grid">
                ${tallesHTML}
            </div>
            <button class="cancelar-talle">Cancelar</button>
        </div>
    `;

    const modalTalle = document.createElement('div');
    modalTalle.className = 'modal-talle';
    modalTalle.innerHTML = modalHTML;
    document.body.appendChild(modalTalle);

    // Eventos para los botones de talle
    modalTalle.querySelectorAll('.btn-talle').forEach(btn => {
        btn.addEventListener('click', () => {
            const talle = btn.dataset.talle;
            agregarProductoConTalle(id, nombre, precio, talle);
            document.body.removeChild(modalTalle);
        });
    });

    modalTalle.querySelector('.cancelar-talle').addEventListener('click', () => {
        document.body.removeChild(modalTalle);
    });
}

function agregarProductoConTalle(id, nombre, precio, talle) {
    const productoId = `${id}-${talle}`;
    const productoExistente = carrito.find(item => item.id === productoId);
    
    if (productoExistente) {
        if (stockProductos[id].talles[talle] > productoExistente.cantidad) {
            productoExistente.cantidad++;
            stockProductos[id].talles[talle]--;
            mostrarNotificacion(`Se agregó otra unidad de ${nombre} (Talle: ${talle})`);
        } else {
            mostrarNotificacion(`No hay más stock disponible de ${nombre} en talle ${talle}`, 'error');
            return;
        }
    } else {
        if (stockProductos[id].talles[talle] > 0) {
            carrito.push({
                id: productoId,
                nombre: nombre,
                precio: precio,
                cantidad: 1,
                talle: talle,
                productoId: id
            });
            stockProductos[id].talles[talle]--;
            mostrarNotificacion(`${nombre} (Talle: ${talle}) agregado al carrito`);
        }
    }

    actualizarCarrito();
    if (!carritoVisible) {
        toggleCarrito();
    }
}

function eliminarDelCarrito(id) {
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        // Si hay más de una unidad, reducir la cantidad
        if (producto.cantidad > 1) {
            producto.cantidad--;
            // Devolver el stock
            const [productoId, talle] = id.split('-');
            stockProductos[productoId].talles[talle]++;
        } else {
            // Si solo hay una unidad, eliminar el producto
            const index = carrito.findIndex(item => item.id === id);
            if (index !== -1) {
                const [productoId, talle] = id.split('-');
                stockProductos[productoId].talles[talle]++;
                carrito.splice(index, 1);
            }
        }
        
        // Actualizar carrito y mostrar notificación
        actualizarCarrito();
        mostrarNotificacion(`Producto eliminado del carrito`, 'success');
    }
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

function actualizarCarrito() {
    const itemsCarrito = document.getElementById('items-carrito');
    const contadorCarrito = document.getElementById('contador-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    
    itemsCarrito.innerHTML = '';
    
    let total = 0;
    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-carrito';
        itemElement.innerHTML = `
            <span>${item.nombre} - Talle: ${item.talle} ${item.cantidad > 1 ? `(${item.cantidad})` : ''}</span>
            <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
            <button class="eliminar-item" onclick="eliminarDelCarrito('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        itemsCarrito.appendChild(itemElement);
        total += item.precio * item.cantidad;
    });

    contadorCarrito.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
    totalCarrito.textContent = total.toFixed(2);
}

function cerrarCarrito() {
    const panel = document.getElementById('carrito-panel');
    const productosContainer = document.querySelector('.productos-container');
    const nav = document.querySelector('nav');
    
    carritoVisible = false;
    panel.classList.remove('activo');
    productosContainer.classList.remove('carrito-abierto');
    nav.classList.remove('carrito-abierto');
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.getElementById('notificacion');
    const mensajeNotificacion = document.getElementById('mensaje-notificacion');
    
    notificacion.className = 'notificacion';
    notificacion.classList.add(tipo);
    mensajeNotificacion.textContent = mensaje;
    notificacion.classList.add('mostrar');
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 2000); // Cambiado a 2 segundos
}

function mostrarConfirmacion(id) {
    productoAEliminar = id;
    const producto = carrito.find(item => item.id === id);
    const modal = document.getElementById('modal-confirmacion');
    const mensaje = document.getElementById('modal-mensaje');
    
    if (producto.cantidad > 1) {
        mensaje.textContent = `¿Qué deseas hacer con ${producto.nombre}? (Cantidad actual: ${producto.cantidad})`;
        document.getElementById('eliminar-uno').style.display = 'block';
    } else {
        mensaje.textContent = `¿Estás seguro que deseas eliminar ${producto.nombre} del carrito?`;
        document.getElementById('eliminar-uno').style.display = 'none';
    }
    
    modal.style.display = 'flex';
}

function cambiarTab(e) {
    e.preventDefault();
    const nuevaTab = e.target.dataset.tab;
    
    // Si es la misma tab, no hacemos nada
    if (nuevaTab === tabActiva) return;

    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Ocultar todas las secciones primero
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const nuevoContenido = document.getElementById(nuevaTab);
    if (nuevoContenido) {
        nuevoContenido.style.display = 'block';
        // Usar setTimeout para asegurar la transición suave
        setTimeout(() => {
            nuevoContenido.classList.add('active');
        }, 10);
    }

    // Actualizar la tab activa
    tabActiva = nuevaTab;

    // Guardar la última tab seleccionada en localStorage
    localStorage.setItem('ultimaTab', nuevaTab);
} 