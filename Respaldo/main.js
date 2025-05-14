// js/main.js
  // js/modal.js

  
  document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-list a');
    const content = document.getElementById('dynamic-content');
  
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
  
        // Solo prevenir comportamiento por defecto si es un enlace interno
        if (href && href.endsWith('.html')) {
          e.preventDefault();
        
          // Evitar cargar contenido si es el enlace "Inicio"
          if (href === 'index.html') {
            content.innerHTML = ''; // Opcional: limpiar el contenedor dinámico
            return;
          }
        
          fetch(href)
            .then(response => {
              if (!response.ok) throw new Error('Error al cargar contenido');
              return response.text();
            })
            .then(html => {
              content.innerHTML = html;
              window.scrollTo({ top: content.offsetTop, behavior: 'smooth' });
            })
            .catch(error => {
              content.innerHTML = `<p>Error al cargar el contenido.</p>`;
              console.error(error);
            });
        }
        
      });
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => { 
    console.log('modal cargado');
  
    // Crear modal
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">×</span>
        <p class="product-info"></p>
        <button class="add-to-cart">Añadir al carrito</button>
      </div>
    `;
    document.body.appendChild(modal);
  
    let currentProduct = {};
  
    // Asociar eventos a productos
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
      product.addEventListener('click', () => {
        const name = product.getAttribute('data-name');
        const price = parseFloat(product.getAttribute('data-price'));
  
        currentProduct = { nombre: name, precio: price };
  
        modal.querySelector('.product-info').textContent = `${name} - $${price.toFixed(2)}`;
        modal.style.display = 'flex';
      });
    });
  
    // Cerrar modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    // Añadir al carrito y guardar en localStorage
    modal.querySelector('.add-to-cart').addEventListener('click', () => {
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
      // Buscar si ya está el producto
      let productoExistente = carrito.find(p => p.nombre === currentProduct.nombre);
      
      if (productoExistente) {
        productoExistente.cantidad += 1;
      } else {
        carrito.push({ ...currentProduct, cantidad: 1 });
      }
  
      localStorage.setItem('carrito', JSON.stringify(carrito));
  
      alert("Producto añadido al carrito");
      modal.style.display = 'none';
    });
  });
  
  /* CARRUCEL DE IAMGENES*/
  document.addEventListener("DOMContentLoaded", () => {
    const carrusel = document.querySelector(".carrusel-ofertas");
    const indicadores = document.querySelectorAll(".indicadores span");
    const totalReal = indicadores.length;
    const visible = 4;
    let index = 1; // Inicia en la PRIMERA IMAGEN REAL (por el clon al inicio)
    let interval;
  
    const ofertas = document.querySelectorAll(".carrusel-ofertas .oferta");
    const porcentaje = 100 / visible;
  
    // Posicionar el carrusel en la primera imagen real
    carrusel.style.transform = `translateX(-${index * porcentaje}%)`;
  
    function actualizarCarrusel(transicion = true) {
      if (transicion) {
        carrusel.style.transition = "transform 0.5s ease-in-out";
      } else {
        carrusel.style.transition = "none";
      }
  
      carrusel.style.transform = `translateX(-${index * porcentaje}%)`;
  
      // Indicadores (sin contar clones)
      indicadores.forEach(dot => dot.classList.remove("activo"));
      indicadores[index - 1 === totalReal ? 0 : (index - 1 + totalReal) % totalReal].classList.add("activo");
    }
  
    function iniciarAutoSlide() {
      interval = setInterval(() => {
        index++;
        actualizarCarrusel();
  
        carrusel.addEventListener("transitionend", () => {
          if (index === totalReal + 1) { // al llegar al clon de la primera
            index = 1;
            actualizarCarrusel(false);
          }
        }, { once: true });
      }, 3000);
    }
  
    function detenerAutoSlide() {
      clearInterval(interval);
    }
  
    indicadores.forEach(dot => {
      dot.addEventListener("click", () => {
        detenerAutoSlide();
        index = parseInt(dot.getAttribute("data-index")) + 1;
        actualizarCarrusel();
        iniciarAutoSlide();
      });
    });
  
    // Iniciar auto slide
    iniciarAutoSlide();
  });

  const contenedor = document.getElementById('carrito-contenido');
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

if (carrito.length === 0) {
  contenedor.innerHTML = "<p>No hay productos en el carrito.</p>";
} else {
  let total = 0;
  carrito.forEach(p => {
    let subtotal = p.precio * p.cantidad;
    total += subtotal;
    contenedor.innerHTML += `
      <div class="producto">
        <span>${p.nombre} x${p.cantidad}</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
    `;
  });

  contenedor.innerHTML += `
    <div class="total">Total: $${total.toFixed(2)}</div>
    <div class="vaciar">
      <button onclick="vaciarCarrito()">Vaciar carrito</button>
    </div>
  `;
}

function vaciarCarrito() {
  localStorage.removeItem('carrito');
  location.reload();
}

// Simulación de productos cargados en el carrito
const productos = [

];

const contenedores = document.getElementById("carrito-contenido");

// Mostrar productos
productos.forEach(producto => {
  const div = document.createElement("div");
  div.classList.add("producto");
  div.innerHTML = `
    <span>${producto.nombre}</span>
    <span>$${producto.precio.toFixed(2)}</span>
  `;
  contenedores.appendChild(div);
});

// Calcular total
const total = productos.reduce((acc, prod) => acc + prod.precio, 0);
const totalDiv = document.createElement("div");
totalDiv.classList.add("total");
totalDiv.textContent = `Total a pagar: $${total.toFixed(2)}`;
contenedores.appendChild(totalDiv);

// Botones
const acciones = document.createElement("div");
acciones.classList.add("acciones");

acciones.innerHTML = `
  <button class="btn-continuar" onclick="cerrarCarritoConTransicion()">
  <i class="fas fa-arrow-left"></i> Seguir comprando
</button>
  <button class="btn-pagar" onclick="pagar()">
    <i class="fas fa-credit-card"></i> Proceder al pago
  </button>
`;

contenedores.appendChild(acciones);

function pagar() {
  alert("Redirigiendo a la pasarela de pago...");
  // Aquí puedes agregar redirección o integración con API
}
function toggleCarrito(event) {
  if (event) event.preventDefault();

  const panel = document.getElementById('carritoPanel');
  const iframe = document.getElementById('carritoIframe');

  if (!panel.classList.contains('abierto')) {
    iframe.src = 'carrito.html'; // Solo se carga una vez
  }

  panel.classList.toggle('abierto');
}
function cerrarCarritoConTransicion() {
  const panel = document.getElementById('carritoPanel');
  panel.classList.remove('abierto');

  // Espera a que la transición termine antes de limpiar el iframe (opcional)
  setTimeout(() => {
    const iframe = document.getElementById('carritoIframe');
    iframe.src = ''; // Limpia si deseas liberar memoria
  }, 500); // Debe coincidir con la duración de tu transición CSS

}
