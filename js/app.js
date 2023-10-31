
let productos = [];
let carrito = [];
let cantpart;
let cantpartit;


localStorage.setItem('productos', JSON.stringify(productos));

let productosCoreog = [];

const selectProductos = document.querySelector('#productos');
const btnAgregar = document.querySelector('#agregar');
const btnVaciar = document.querySelector('#vaciar');

function popularDropdown() {
  productos.forEach(({nombre, preciopp}, index) => { 
    const option = document.createElement('option');
    option.textContent = `${nombre} - precio por participante $${preciopp}`;
    option.value = index; 
    selectProductos.appendChild(option);
  });
}

async function traerProductos() {
  const response = await fetch('./tiposCoreog.json');
  if (response.ok){
    productosCoreog= await response.json();
    productos = productosCoreog; 
  }
  popularDropdown();
}

carrito = JSON.parse(localStorage.getItem('carrito')) || [];



document.addEventListener('DOMContentLoaded', () => {
  traerProductos();
  dibujarTabla();
  

  btnAgregar.addEventListener('submit', (e) => {
    e.preventDefault();
    const productoSeleccionado = productos.find((item, index) => index === +selectProductos.value);

    if (productoSeleccionado === undefined) {
      alert('Usted primero debe seleccionar un producto');
      return;
    }

    if (productoSeleccionado.nombre !== productos[3].nombre) {
      cantpart = 1;
      cantpartit = productoSeleccionado.particip * cantpart;
      const item = new Item(productoSeleccionado.nombre, productoSeleccionado.preciopp, cantpartit);
      carrito.push(item);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      dibujarTabla();
    } else {
      Swal.fire({
        title: 'Ingresa la cantidad de participantes del grupal:',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (value <= 3 || value>=31) {
            return 'Debes ingresar una cantidad igual o mayor a 4 y menor o igual a 30';
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          cantpart = parseInt(result.value);
          cantpartit = productoSeleccionado.particip * cantpart;
          const item = new Item(productoSeleccionado.nombre, productoSeleccionado.preciopp, cantpartit);
          carrito.push(item);
          localStorage.setItem('carrito', JSON.stringify(carrito));
          dibujarTabla();
          Swal.fire(`Ingresaste: ${cantpart}`);
        }
      });
    }
  });
});

btnVaciar.addEventListener('click', vaciarCarrito);

function vaciarCarrito() {
  carrito = [];
  localStorage.setItem('carrito', JSON.stringify(carrito));
  dibujarTabla();
};

function dibujarTabla() {
  const bodyTabla = document.getElementById('items');
  const totalpart = document.querySelector('#totalpart');
  const total = document.querySelector('#total');
  bodyTabla.innerHTML = '';

  carrito.forEach((item, index) => {
    const { nombre, preciopp, cantpart } = item;

    const row = document.createElement('tr');
    row.className = 'text-white';

    row.innerHTML = `
      <td>${index + 1 || ''}</td>
      <td>${nombre || ''}</td>
      <td>${cantpart || ''}</td>
      <td>$${preciopp || ''}</td>
      <td>$${cantpart * preciopp || 0}</td>
      <td>
        <button class="btn btn-light quitar-btn">Quitar</button>
      </td>
    `;

    bodyTabla.appendChild(row);
  });

  const quitarButtons = document.querySelectorAll('.quitar-btn');
  quitarButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      dibujarTabla();
    });
  });

  totalpart.textContent = carrito.reduce((acc,item) => acc + item.cantpart , 0);
  
  total.textContent = `$${carrito.reduce((acc, item) => acc + item.preciopp * item.cantpart, 0)}`;
}



