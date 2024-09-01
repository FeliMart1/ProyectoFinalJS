let carrito = [];
let totalCompra = 0;
let precioPrenda = 0;
let descuento = 0;
let usuarioIngresado;
let contraseniaIngresada;
let usuarios = [];
let compras = [];
let prendas = [];

fetch("prendas.json")
    .then(response => response.json())
    .then(data => {
        prendas = data;
        cargarProductos(productos); 
    });


function inicializar() {
    cargarProductos();
    cargarDatosLocalStorage();
    actualizarBotonLogin();
    mostrarCarrito(); 
    mostrarHistorial(); 
}

document.addEventListener("DOMContentLoaded", inicializar);

function actualizarBotonLogin() {
    const usuarioIngresado = localStorage.getItem('usuarioIngresado');
    const loginButton = document.getElementById('login-button');
    if (usuarioIngresado) {
        loginButton.textContent = `Cerrar Sesión (${usuarioIngresado})`;
        loginButton.onclick = function() {
            localStorage.removeItem('usuarioIngresado');
            alert('Cerraste sesión correctamente');
            window.location.href = 'index.html';
        };
    } else {
        loginButton.textContent = 'Iniciar Sesión';
        loginButton.onclick = function() {
            window.location.href = 'inicio.html';
        };
    }
}

function cargarProductos() {
    let productosDiv = document.getElementById("productos");
    prendas.forEach(prenda => {
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<img src="${prenda.imagen}" alt="${prenda.nombre}">
                          <h2>${prenda.nombre}</h2>
                          <p>$${prenda.precio}</p>
                          <button onclick="agregarCarrito(${prenda.id})">Agregar al carrito</button>`;
        productosDiv.appendChild(card);
    });
}

function agregarCarrito(id) {
    Toastify({
        text: "Agregado al carrito.",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    const prenda = prendas.find(prenda => prenda.id === id);
    if (prenda) {
        carrito.push({ nombre: prenda.nombre, precio: prenda.precio });
        guardarDatosLocalStorage();
        mostrarCarrito(); 
        
    }
}

function mostrarCarrito() {
    let carritoCompras = document.getElementById("carrito-compras");
    carritoCompras.innerHTML = "";
    carrito.forEach((item, index) => {
        let compra = document.createElement("div");
        compra.className = "compra";
        compra.innerHTML = `<p>${item.nombre}: $${item.precio}</p>`;
        carritoCompras.appendChild(compra);
    });
}

function borrarHistorial() {
    compras = [];
    guardarDatosLocalStorage();
    mostrarHistorial(); // Actualiza el historial en tiempo real
}

function mostrarHistorial() {
    let historialCompras = document.getElementById("historial-compras");
    historialCompras.innerHTML = "";
    compras.forEach((compra, index) => {
        let compraDiv = document.createElement("div");
        compraDiv.className = "compra";
        compraDiv.innerHTML = `<p>Compra ${index + 1}: $${compra}</p>`;
        historialCompras.appendChild(compraDiv);
    });
}


function borrarPrenda() {
    carrito.pop();
    guardarDatosLocalStorage();
    mostrarCarrito(); 
    Toastify({
        text: "Eliminaste el ultimo item correctamente.",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #ff3b2f, #ff6f61)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
}


function realizarCompra() {


    const usuarioIngresado = localStorage.getItem('usuarioIngresado');
    if (!usuarioIngresado) {
        alert("Debes iniciar sesión para realizar una compra.");
        return;
    }

    let totalCompraFinal = carrito.reduce((total, item) => total + item.precio, 0);
    totalCompraFinal = totalCompraFinal - (totalCompraFinal * descuento);

    if (totalCompraFinal === 0) {
        Swal.fire("El carrito esta vacio!");        return; 
    }

    Swal.fire("El total de la compra es $ "+ totalCompraFinal);
    compras.push(totalCompraFinal);
    carrito = [];
    guardarDatosLocalStorage();
    mostrarCarrito(); 
    mostrarHistorial(); 

    Swal.fire({
        title: "Realizaste la compra!",
        text: ("El total de la compra es $ "+ totalCompraFinal),
        icon: "success"
    });

}


function guardarDatosLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("compras", JSON.stringify(compras));
}

function cargarDatosLocalStorage() {
    let carritoLocalStorage = JSON.parse(localStorage.getItem("carrito"));
    let comprasLocalStorage = JSON.parse(localStorage.getItem("compras"));
    if (carritoLocalStorage) carrito = carritoLocalStorage;
    if (comprasLocalStorage) compras = comprasLocalStorage;
}