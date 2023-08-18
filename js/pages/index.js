// Función para agregar cartelera al HTML
async function crearCartelera() {
    const resultados = await obtenerDatosAPI(paginaActual);

    const cartelera = document.getElementById('contenedorPeliculas');
    cartelera.innerHTML = '';

    for (const pelicula of resultados) {
        const { poster_path, title, id, original_title, original_language, release_date } = pelicula;

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('cartelera');
        tarjeta.innerHTML = `
        <img class="poster" src="https://image.tmdb.org/t/p/w500/${poster_path}">
        <h3 class="titulo">${title}</h3>
        <p><b>Código:</b> <span class="codigo">${id}</span><br>
        <b>Título original:</b> ${original_title}<br>
        <b>Idioma original:</b> ${original_language}<br>
        <b>Año:</b> ${release_date}<br>
        <button class="button radius medium agregar-favoritos">Agregar a Favoritos</button>`;

        cartelera.appendChild(tarjeta);
    }

    const paginaActualElement = document.getElementById('paginaActual');
    paginaActualElement.textContent = `Pag. ${paginaActual}`;

}

// Cambiar a la página anterior
function irPaginaAnterior() {
    if (paginaActual > 1) {
        paginaActual--;
        crearCartelera();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cambiar a la página siguiente
function irPaginaSiguiente() {
    paginaActual++;
    crearCartelera();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Asignar eventos a los botones de paginación
document.getElementById('btnAnterior').addEventListener('click', irPaginaAnterior);
document.getElementById('btnSiguiente').addEventListener('click', irPaginaSiguiente);

// Llamar a la función para mostrar la cartelera inicial
crearCartelera();

// Función para agregar películas a favoritos por código
async function agregarPeliculaPorCodigo(codigo) {
    const favoritos = JSON.parse(localStorage.getItem('FAVORITOS')) || [];

    if (favoritos.includes(codigo)) {
        mostrarMensaje('warning-message');
        return;
    }

    if (isNaN(codigo)) {
        mostrarMensaje('error-message');
        return;
    }

    let peliculaEncontrada = null;
    let pagina = 1;

    while (!peliculaEncontrada) {
        const resultados = await obtenerDatosAPI(pagina);
        peliculaEncontrada = resultados.find((pelicula) => pelicula.id === codigo);
        pagina++;

        if (pagina > resultados.total_pages) {
            mostrarMensaje('error-message');
            return;
        }
    }

    favoritos.push(codigo);
    localStorage.setItem('FAVORITOS', JSON.stringify(favoritos));
    mostrarMensaje('success-message');

    // Realizar desplazamiento hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para agregar películas a favoritos por boton
async function agregarPeliculaDesdeBoton(event) {
    if (event.target.classList.contains('agregar-favoritos')) {
        const tarjeta = event.target.closest('.cartelera');
        const codigo = parseInt(tarjeta.querySelector('.codigo').textContent);
        await agregarPeliculaPorCodigo(codigo);
    }
}

// Función para mostrar mensajes
function mostrarMensaje(idMensaje) {
    const mensaje = document.getElementById(idMensaje);
    mensaje.style.display = 'block';
    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 2500);
}

// Asignar evento de submit al formulario para agregar películas por código
const formFavoritos = document.getElementById('form-favoritos');
formFavoritos.addEventListener('submit', async event => {
    event.preventDefault();
    const codigoInput = document.getElementById('movie-code');
    const codigo = parseInt(codigoInput.value.trim());
    await agregarPeliculaPorCodigo(codigo);
    codigoInput.value = '';
});

// Obtener el contenedor de las tarjetas de película
const cartelera = document.getElementById('contenedorPeliculas');

// Agregar evento de clic a través de la delegación de eventos para agregar películas desde el botón "Agregar a Favoritos"
cartelera.addEventListener('click', agregarPeliculaDesdeBoton);