// Acordeón interactivo
document.addEventListener("DOMContentLoaded", function() {
  const items = document.querySelectorAll(".accordion-header");

  items.forEach(item => {
    item.addEventListener("click", function() {
      const content = this.nextElementSibling;

      // Cerrar cualquier otro acordeón abierto
      document.querySelectorAll(".accordion-content").forEach(c => {
        if (c !== content) {
          c.style.display = "none";
          c.previousElementSibling.classList.remove("active");
        }
      });

      // Alternar el contenido actual
      content.style.display = content.style.display === "block" ? "none" : "block";
      this.classList.toggle("active");
    });
  });
});

// Función para manejar el menú de navegación en dispositivos móviles
const navSlide = () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');
  const navItems = document.querySelectorAll('.nav-links a');
  const body = document.body;

  // Función para cerrar el menú
  const closeMenu = () => {
      nav.classList.remove('nav-active');
      burger.classList.remove('toggle');
      body.classList.remove('no-scroll');
      navLinks.forEach((link) => {
          link.style.animation = '';
      });
  };

  // Toggle del menú
  burger.addEventListener('click', () => {
      nav.classList.toggle('nav-active');
      body.classList.toggle('no-scroll');

      // Animate Links
      navLinks.forEach((link, index) => {
          if (link.style.animation) {
              link.style.animation = '';
          } else {
              link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
          }
      });

      // Burger Animation
      burger.classList.toggle('toggle');
  });

  // Cerrar menú al hacer clic en un enlace
  navItems.forEach((item) => {
      item.addEventListener('click', closeMenu);
  });

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener('click', (event) => {
      const isClickInsideNav = nav.contains(event.target);
      const isClickOnBurger = burger.contains(event.target);
      if (nav.classList.contains('nav-active') && !isClickInsideNav && !isClickOnBurger) {
          closeMenu();
      }
  });
};

// Función para manejar la animación de entrada inicial
function handleEntranceAnimation() {
  const header = document.querySelector('header');
  const title = document.querySelector('.hero h1');
  const button = document.querySelector('.cta-button');

  // Aplica las clases con un ligero retraso para cada elemento
  setTimeout(() => header.classList.add('fade-in'), 100);
  setTimeout(() => title.classList.add('fade-in'), 300);
  setTimeout(() => button.classList.add('fade-in'), 500);
}

// Función para manejar las animaciones de entrada de la sección "Sobre mí"
function handleEntranceAnimations() {
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('appear');
          }
      });
  }, { threshold: 0.1 });

  document.querySelectorAll('.slide-in-left, .fade-in-up, .rotate-in').forEach(el => {
      observer.observe(el);
  });
}

// Efecto parallax suave para la imagen principal
function handleParallax() {
  const mainImage = document.querySelector('.main-image');
  window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      mainImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
  });
}

// Transición suave entre secciones
function handleSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth'
          });
      });
  });
}

// Cambiar el fondo del header al hacer scroll
function handleHeaderBackground() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.style.background = 'rgba(255,255,255,0.9)';
      } else {
          header.style.background = 'linear-gradient(to bottom, rgba(255,255,255,1) 85%, rgba(255,255,255,0) 100%)';
      }
  });
}

// Variable global para almacenar los artículos filtrados
let filteredArticles = [];

// Función para manejar el filtrado de artículos del blog
function handleBlogFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  const noResultsMessage = document.getElementById('no-results-message');
  const searchInput = document.querySelector('.search-bar input');

  // Inicializar filteredArticles con todos los artículos
  filteredArticles = Array.from(blogCards);

  // Ordenar los artículos por fecha (de más reciente a más antiguo)
  filteredArticles.sort((a, b) => {
    const dateA = new Date(a.querySelector('time').getAttribute('datetime'));
    const dateB = new Date(b.querySelector('time').getAttribute('datetime'));
    return dateB - dateA;
  });

  // Actualizar la paginación después de ordenar los artículos
  currentPage = 1;
  handleBlogPagination();

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Actualizar botones activos
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Ocultar el mensaje de "No se encontraron artículos"
      noResultsMessage.style.display = 'none';
      
      // Resetear la barra de búsqueda
      searchInput.value = '';
      
      // Filtrar tarjetas
      filteredArticles = Array.from(blogCards).filter(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          return true;
        } else {
          return false;
        }
      });
      
      // Ordenar los artículos filtrados por fecha (de más reciente a más antiguo)
      filteredArticles.sort((a, b) => {
        const dateA = new Date(a.querySelector('time').getAttribute('datetime'));
        const dateB = new Date(b.querySelector('time').getAttribute('datetime'));
        return dateB - dateA;
      });
      
      // Si no hay tarjetas visibles, mostrar el mensaje
      if (filteredArticles.length === 0) {
        noResultsMessage.style.display = 'block';
      }

      // Actualizar la paginación después de filtrar
      currentPage = 1;
      handleBlogPagination();
    });
  });
}

// Función para manejar la búsqueda en los artículos del blog
function handleBlogSearch() {
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');
  const noResultsMessage = document.getElementById('no-results-message');

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let searchResults = filteredArticles.filter(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const content = card.querySelector('p').textContent.toLowerCase();
      const category = card.querySelector('.category').textContent.toLowerCase();

      return title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm);
    });

    // Ordenar los resultados de búsqueda de más recientes a más antiguos
    searchResults.sort((a, b) => {
      const dateA = new Date(a.querySelector('time').getAttribute('datetime'));
      const dateB = new Date(b.querySelector('time').getAttribute('datetime'));
      return dateB - dateA;
    });

    // Actualizar la paginación con los resultados de búsqueda
    filteredArticles = searchResults;
    currentPage = 1;
    handleBlogPagination();

    // Mostrar u ocultar el mensaje de "No se encontraron artículos"
    if (searchResults.length > 0) {
      noResultsMessage.style.display = 'none';
    } else {
      noResultsMessage.style.display = 'block';
    }
  }

  searchButton.addEventListener('click', performSearch);

  searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  });
}

// Función para manejar la paginación de los artículos del blog
function handleBlogPagination() {
  const blogGrid = document.querySelector('.blog-grid');
  const paginationContainer = document.querySelector('.pagination');
  const itemsPerPage = 9;
  let currentPage = 1;

  // Función para mostrar los artículos de la página actual
  function showPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Limpiar el grid antes de añadir los artículos
    blogGrid.innerHTML = '';

    // Mostrar los artículos de la página actual
    filteredArticles.slice(startIndex, endIndex).forEach(article => {
      blogGrid.appendChild(article); // Insertar en el orden correcto
      article.style.display = 'block'; // Asegurarse de que se muestren
    });
  }

  // Función para crear botones de paginación
  function createPagination() {
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    // Limpiar paginación existente
    paginationContainer.innerHTML = '';

    // Crear botones de página
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.classList.add('page-btn');
      pageButton.textContent = i;

      // Agregar clase activa al botón actual
      if (i === currentPage) {
        pageButton.classList.add('active');
      }

      // Manejar el evento de clic en los botones de página
      pageButton.addEventListener('click', function() {
        currentPage = i;
        showPage(currentPage);
        createPagination(); // Actualizar botones de paginación
      });

      paginationContainer.appendChild(pageButton);
    }

    // Crear botón "Siguiente" si no estamos en la última página
    if (currentPage < totalPages) {
      const nextButton = document.createElement('button');
      nextButton.classList.add('page-btn');
      nextButton.textContent = 'Siguiente';

      nextButton.addEventListener('click', function() {
        currentPage++;
        showPage(currentPage);
        createPagination(); // Actualizar botones de paginación
      });

      paginationContainer.appendChild(nextButton);
    }
  }

  // Inicializar la paginación
  showPage(currentPage);
  createPagination();
}

// ENVIO EMAILJL
const btn = document.getElementById('button');

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Enviando...';

   const serviceID = 'default_service';
   const templateID = 'template_3dg5uga';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Enviar';
      alert('Email enviado correctamente');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
    // Resetea el formulario
    document.getElementById('form').reset();

});

// Ejecutar todas las funciones cuando la página se carga
window.addEventListener('load', () => {
  navSlide();
  handleEntranceAnimation();
  handleEntranceAnimations();
  handleParallax();
  handleSmoothScroll();
  handleHeaderBackground();
  handleBlogFilters();
  handleBlogSearch(); 
  handleBlogPagination();
});