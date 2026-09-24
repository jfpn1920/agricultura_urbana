//--------------------------------------//
//--|funcionalidad_agricultura_urbana|--//
//--------------------------------------//
const tarjetas_producto = document.querySelectorAll(".tarjeta_producto");
const botones_carrito = document.querySelectorAll(".boton_carrito");
const botones_favorito = document.querySelectorAll(".boton_favorito");
const cantidad_carrito = document.getElementById("cantidad_carrito");
const total_carrito = document.getElementById("total_carrito");
const vaciar_carrito = document.getElementById("vaciar_carrito");
//----------------------------------------------//
//--|cargar_y_guardar_carrito_en_localstorage|--//
//----------------------------------------------//
let carrito = JSON.parse(localStorage.getItem("carrito_agricultura")) || [];
function guardar_carrito() {
    localStorage.setItem("carrito_agricultura", JSON.stringify(carrito));
}
//----------------------//
//--|agregar_producto|--//
//----------------------//
function agregar_producto(tarjeta) {
    const nombre = tarjeta.dataset.nombre;
    const precio = Number(tarjeta.dataset.precio);
    const producto_existente = carrito.find(
            function(producto) {
                return producto.nombre === nombre;
            }
        );
    if (producto_existente) {
        producto_existente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    guardar_carrito();
    actualizar_carrito();
}
//------------------------//
//--|actualizar_carrito|--//
//------------------------//
function actualizar_carrito() {
    let cantidad_total = 0;
    let precio_total = 0;
    carrito.forEach(
        function(producto) {
            cantidad_total += producto.cantidad;
            precio_total += producto.precio * producto.cantidad;
        }
    );
    cantidad_carrito.textContent = cantidad_total;
    total_carrito.textContent = "$" + precio_total.toFixed(2);
}
//---------------------//
//--|eventos_carrito|--//
//---------------------//
botones_carrito.forEach(
    function(boton) {
        boton.addEventListener(
            "click",
            function() {
                const tarjeta = boton.closest(".tarjeta_producto");
                agregar_producto(tarjeta);
                boton.classList.add("agregado");
                boton.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
                setTimeout(
                    function() {
                        boton.classList.remove("agregado");
                        boton.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
                    }, 1000
                );
            }
        );
    }
);
//------------------------------------------------//
//--|guardar_y_cargar_favoritos_en_localstorage|--//
//------------------------------------------------//
function guardar_favoritos() {
    const favoritos = [];
    tarjetas_producto.forEach(
        function(tarjeta, indice) {
            const boton = tarjeta.querySelector(".boton_favorito");
            if (boton.classList.contains("activo")) {
                favoritos.push(indice);
            }
        }
    );
    localStorage.setItem("favoritos_agricultura", JSON.stringify(favoritos));
}
function cargar_favoritos() {
    const datos = localStorage.getItem("favoritos_agricultura");
    if (!datos) {
        return;
    }
    const favoritos = JSON.parse(datos);
    favoritos.forEach(
        function(indice) {
            const tarjeta = tarjetas_producto[indice];
            if (!tarjeta) {
                return;
            }
            const boton = tarjeta.querySelector(".boton_favorito");
            const icono = boton.querySelector("i");
            boton.classList.add("activo");
            icono.classList.remove("fa-regular");
            icono.classList.add("fa-solid");
        }
    );
}
//-----------------------//
//--|eventos_favoritos|--//
//-----------------------//
botones_favorito.forEach(
    function(boton) {
        boton.addEventListener(
            "click",
            function() {
                boton.classList.toggle("activo");
                const icono = boton.querySelector("i");
                if (boton.classList.contains("activo")) {
                    icono.classList.remove("fa-regular");
                    icono.classList.add("fa-solid");
                } else {
                    icono.classList.remove("fa-solid");
                    icono.classList.add("fa-regular");
                }
                guardar_favoritos();
            }
        );
    }
);
//--------------------//
//--|vaciar_carrito|--//
//--------------------//
vaciar_carrito.addEventListener(
    "click",
    function() {
        if (carrito.length === 0) {
            return;
        }
        const confirmar = confirm("¿Deseas vaciar el carrito?");
        if (!confirmar) {
            return;
        }
        carrito = [];
        localStorage.removeItem("carrito_agricultura");
        actualizar_carrito();
    }
);
actualizar_carrito();
cargar_favoritos();