localUsuarios = JSON.parse(localStorage.getItem("usuarios"));

const usuarios = localUsuarios ? localUsuarios : [];

//Lógica para que cambie de página /tienda/registro/inicio sesion
document
  .getElementById("btn-registro")
  .addEventListener("click", mostrarRegistro);
document
  .getElementById("btn-inicio")
  .addEventListener("click", mostrarInicioSesion);
document.getElementById("btn-tienda").addEventListener("click", mostrarTienda);
document.getElementById("logo").addEventListener("click", mostrarTienda);

actualizarGorras()

function mostrarRegistro() {
  document.getElementById("tienda").classList.add("d-none");
  document.getElementById("registro").classList.remove("d-none");
  document.getElementById("inicio-sesion").classList.add("d-none");

  document.getElementById("btn-tienda").classList.remove("d-none");
  document.getElementById("btn-inicio").classList.remove("d-none");
  document.getElementById("btn-registro").classList.add("d-none");
}

function mostrarInicioSesion() {
  document.getElementById("tienda").classList.add("d-none");
  document.getElementById("registro").classList.add("d-none");
  document.getElementById("inicio-sesion").classList.remove("d-none");

  document.getElementById("btn-tienda").classList.remove("d-none");
  document.getElementById("btn-inicio").classList.add("d-none");
  document.getElementById("btn-registro").classList.remove("d-none");
}

function mostrarTienda() {
  document.getElementById("tienda").classList.remove("d-none");
  document.getElementById("registro").classList.add("d-none");
  document.getElementById("inicio-sesion").classList.add("d-none");

  document.getElementById("btn-tienda").classList.add("d-none");
  document.getElementById("btn-inicio").classList.remove("d-none");
  document.getElementById("btn-registro").classList.remove("d-none");
}

//Guardar los parametros que se ingresaron en los input de registro y validar si ya estan registrados

document.getElementById("enviar-registro").addEventListener("click", guardar);

function guardar() {
  let nombre = document.getElementById("nombre-registro").value;
  let apellido = document.getElementById("apellido-registro").value;
  let usuario = document.getElementById("usuario-registro").value;
  let contrasena = document.getElementById("contrasena-registro").value;

  let nuevoUsuario = {
    nombre: nombre,
    apellido: apellido,
    usuario: usuario,
    contrasena: contrasena,
  };

  validarNuevoUsuario(nuevoUsuario);
}

function validarNuevoUsuario(usuariosIngresado) {
  let usuarioEncontrado;

  let usuariosFiltrados = usuarios.filter(
    (u) => u.usuario === usuariosIngresado.usuario
  );

  if (usuariosFiltrados.length === 1) {
    usuarioEncontrado = usuariosFiltrados[0];
  }

  if (usuarioEncontrado) {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Este usuario ya esta en uso, intenta uno diferente",
    });
  } else {
    usuarios.push(usuariosIngresado);
    localStorage.setItem("usuarios", JSON.stringify([...usuarios]));
    Swal.fire({
      icon: "success",
      title: "Registro exitoso!",
      showConfirmButton: false,
    });
    ocultar();
  }
}

//Registro y validacion de usuarios en el inicio de sesion
document
  .getElementById("enviar-inicio")
  .addEventListener("click", iniciarSesion);

function iniciarSesion() {
  let usuario = document.getElementById("usuario-inicio").value;
  let contrasena = document.getElementById("contrasena-inicio").value;

  let usuariosUsados = {
    usuario: usuario,
    contrasena: contrasena,
  };
  validarInicioSesion(usuariosUsados);
}

function validarInicioSesion(usuarioParaValidar) {
  let usuarioEncontradoInicio;

  let usuariosFiltradosInicio = usuarios.filter(
    (u) =>
      u.usuario === usuarioParaValidar.usuario &&
      u.contrasena === usuarioParaValidar.contrasena
  );

  if (usuariosFiltradosInicio.length === 1) {
    usuarioEncontradoInicio = usuariosFiltradosInicio[0];
  }
  if (!usuarioEncontradoInicio) {
    Swal.fire({
      title: "Credenciale incorrectas",
      text: "Usuario o contraseña incorrecto",
      icon: "error",
    });
  } else {
    Swal.fire({
      title:
        "Bienvenido, " +
        usuarioEncontradoInicio.nombre +
        " " +
        usuarioEncontradoInicio.apellido,
      text: "Tu inicio ha sido exitoso",
      icon: "success",
    });
  }
}

//Carrito de compras

document.addEventListener("DOMContentLoaded", function () {
  const carrito = {};

  document.querySelectorAll(".btn-comprar").forEach((button) => {
    button.addEventListener("click", function () {
      const productoId = this.getAttribute("data-id");
      const productoTitulo =
        this.closest(".card-body").querySelector(".card-title").textContent;
      const precioTexto =
        this.closest(".card-body").querySelector(".card-text").textContent;
      const precio = parseFloat(precioTexto.replace(/[^0-9.-]+/g, ""));

      if (carrito[productoId]) {
        carrito[productoId].cantidad++;
      } else {
        carrito[productoId] = {
          titulo: productoTitulo,
          precio: precio,
          cantidad: 1,
        };

        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Se agregó correctamente al carrito.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      actualizarCarrito();
    });
  });

  function actualizarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    listaCarrito.innerHTML = "";
    Object.values(carrito).forEach((producto) => {
      const item = document.createElement("li");
      item.classList.add("list-group-item");
      item.textContent = `${producto.titulo} - ${
        producto.cantidad
      } x $${producto.precio.toLocaleString()} = $${(
        producto.precio * producto.cantidad
      ).toLocaleString()}`;
      listaCarrito.appendChild(item);
    });

    //el contador en el ícono del carrito
    const contadorCarrito = document.getElementById("contador-carrito");
    const totalItems = Object.values(carrito).reduce(
      (sum, prod) => sum + prod.cantidad,
      0
    );
    contadorCarrito.textContent = totalItems;
  }
});

function actualizarGorras() {
  fetch('http://52.6.29.39:8000/caps/').then(
    (respuesta) => {
      respuesta.json().then((data) => {
        let htmlCompleto = ''
        for (const gorra of data) {
          let formatPrice = parseFloat(gorra.price)
          let htmlResultado = `
          <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="card shadow m-4 bg-body-tertiary" style="width: 18rem;">
              <img src="${gorra.image}"
                class="card-img-top" alt="caballo">
              <div class="card-body">
                <h5 class="card-title text-center">${gorra.name}</h5>
                <p class="card-text text-center">${gorra.description} <strong>$ ${formatPrice}</strong> </p>
                <div class="row m-2">
                  <button type="button" class="btn btn-dark btn-comprar" data-id="1">Comprar</button>
                </div>
              </div>
            </div>
          </div>
          `
          htmlCompleto = htmlCompleto + htmlResultado
        }
        
        document.getElementById('container-products').innerHTML = htmlCompleto
      }).catch(
        (error) => {
          console.error(error)
        }
      )
    }
  ).catch(
    (error) => {
      console.error(error)
    }
  )
}
