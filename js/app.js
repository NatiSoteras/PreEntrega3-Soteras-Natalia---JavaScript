
let productos = [];
let carrito = [];
let cantpart;
let cantpartit;
///Descomentar para ejecutar esto una vez y que se cargue al localStorage los productos
//productos.push(new Producto('Solista',2000,1));
//productos.push(new Producto('Dúo',3600,2));
//productos.push(new Producto('Trío',4500,3));
//productos.push(new Producto('Grupal',1200,1));//


//localStorage.setItem('productos', JSON.stringify(productos));

let productosCoreog = [];

fetch('./tiposCoreog.json') 
    .then((response) => {
        if (response.ok) {
           return response.json(); 
        }
    })
    .then((productos) => {
      
        productosCoreog = productos;
        console.log(productosCoreog);
    })



const selectProductos = document.querySelector('#productos');
const btnAgregar = document.querySelector('#agregar');



function traerItemsStorage() {
    productos = JSON.parse(localStorage.getItem('productos')) || [];
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

}


function popularDropdown() {
    productos.forEach(({nombre,porpart}, index) => { 
       
        const option = document.createElement('option');
        option.textContent = `${nombre} - precio por participante $${porpart}`;
        option.value = index; 
        selectProductos.appendChild(option);
    });
}




document.addEventListener('DOMContentLoaded', () => {
    traerItemsStorage();
    popularDropdown();
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
      const item = new Item(productoSeleccionado.nombre, productoSeleccionado.porpart, cantpartit);
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
          if (value <= 3) {
            return 'Debes ingresar una cantidad igual o mayor a 4';
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          cantpart = parseInt(result.value);
          cantpartit = productoSeleccionado.particip * cantpart;
          const item = new Item(productoSeleccionado.nombre, productoSeleccionado.porpart, cantpartit);
          carrito.push(item);
          localStorage.setItem('carrito', JSON.stringify(carrito));
          dibujarTabla();
          Swal.fire(`Ingresaste: ${cantpart}`);
        }
        
      });
    }
  })
});
  


function dibujarTabla() {
    const bodyTabla = document.getElementById('items');
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
    
    
    total.textContent = carrito.reduce((acc, item) => acc + item.preciopp * item.cantpart, 0);
  }
  