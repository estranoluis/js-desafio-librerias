// Variable carrito para que detecte si existen valores en el storage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
// Variables de monto y cantidad asi se mantienen los datos al refrescar la ventana
let montoTotalCompra = calcularTotalCarrito();
let cantidadTotalCompra = carrito.length;
// Document ready con todo el codigo generado por el DOM
$(document).ready(function () {
  // Seccion carrito a traves jquery y dom
  $("#section-carrito").append(`<div> 
                              <h2>Total: $</h2> 
                              <h2 id="montoTotalCompra">${montoTotalCompra}</h2>
                              </div>
                              <div> 
                              <h2>Cantidad de productos:</h2> 
                              <h3 id="cantidadTotalCompra">${cantidadTotalCompra}</h3>
                              </div>
                              <button class="boton" id="btn-finalizar">Finalizar compra</button>`);
  // Boton finalizar compra (como confirmacion)
  $("#btn-finalizar").on('click', function () {
    const precioFinal = $("#montoTotalCompra").text();
    // Sweet alert para confirmar y tambien vacia el carrito
    Swal.fire({
      title: '¿Seguro que queres finalizar tu compra?',
      text: `Total a abonar: $${precioFinal}`,
      showCancelButton: true,
      confirmButtonColor: '#008f39',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      result.isConfirmed && Swal.fire(
        'Compra confirmada',
        '¡Que lo disfrutes!',
        'success'
        )
      vaciarCarrito();
      }
    )}
  );
  //Se agrega selector para ordenar productos
  $("#seleccion option[value='pordefecto']").attr("selected", true);
  $("#seleccion").on("change", ordenarProductos);
  // Se llama la funcion para crear las cards
  productCards();
})

function productCards() {
  for (const producto of productos) {
    $("#section-productos").append(`<div class="card-product"> 
                            <div class="img-container">
                            <img src="${producto.foto}" alt="${producto.nombre}" class="img-product"/>
                            </div>
                            <div class="info-producto">
                            <p class="font">${producto.nombre}</p>
                            <p class="font">${producto.descripcion}</p>
                            <strong class="font">$${producto.precio}</strong>
                            <button class="botones" id="btn${producto.id}"> Agregar al carrito </button>
                            </div>
                            </div>`)
    $(`#btn${producto.id}`).on('click', function () {
    agregarAlCarrito(`${producto.id}`)
    });
  }
};

// Funcion que ordena productos segun precio, orden alfabetico y por defecto 
function ordenarProductos() {
  let seleccion = $("#seleccion").val();
    if (seleccion == "defecto") {
    productos.sort(function (a, b) {
        return a.id - b.id
    });
    } else if (seleccion == "menor") {
    productos.sort(function (a, b) {
        return a.precio - b.precio
    });
    } else if (seleccion == "mayor") {
    productos.sort(function (a, b) {
        return b.precio - a.precio
    });
    } else if (seleccion == "alfabetico") {
    productos.sort(function (a, b) {
        return a.nombre.localeCompare(b.nombre);
    });
    }
    // Se llama de nuevo la funcion luego de ordenar
    $(".card-product").remove();
    productCards();
  }

function agregarAlCarrito(id) {
  carrito.push(productos.find(p => p.id == id));
  localStorage.setItem("carrito", JSON.stringify(carrito));
  calcularTotalCarrito();
}

function calcularTotalCarrito() {
  let total = 0;
  for (const producto of carrito) {
      total += producto.precio;
  }
  $("#montoTotalCompra").text(total);
  $("#cantidadTotalCompra").text(carrito.length);
  return total;
}

function vaciarCarrito() {
  $("#montoTotalCompra").text("0");
  $("#cantidadTotalCompra").text("0");
  localStorage.clear();
  carrito = [];
}
