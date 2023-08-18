// Función para obtener las películas favoritas almacenadas en localStorage
function obtenerPeliculasFavoritas() {
    const favoritos = JSON.parse(localStorage.getItem('FAVORITOS')) || [];
    return favoritos;
}

// Función para mostrar las películas favoritas en el HTML
async function mostrarPeliculasFavoritas() {
    const peliculasFavoritas = obtenerPeliculasFavoritas();
    const contenedorFavoritas = document.getElementById('contenedorFavoritas');
    const mensajeNoPeliculas = document.getElementById('mensajeNoPeliculas');
    const mensajeError = document.getElementById('mensajeError');

    // Limpiar el contenido actual del contenedor
    contenedorFavoritas.innerHTML = '';

    if (peliculasFavoritas.length === 0) {
        // Mostrar mensaje de falta de películas
        mensajeNoPeliculas.style.display = 'block';
        mensajeError.style.display = 'none';
    } else {
        try {
            // Mostrar las películas favoritas
            for (const codigo of peliculasFavoritas) {
                const pelicula = await obtenerPeliculaPorCodigo(codigo);

                if (pelicula) {
                    const {
                        poster_path,
                        title,
                        id,
                        original_title,
                        original_language,
                        release_date,
                        overview
                    } = pelicula;

                    const tarjeta = document.createElement('div');
                    tarjeta.classList.add('favorita');
                    tarjeta.innerHTML = `
                <img class="poster" src="https://image.tmdb.org/t/p/w500/${poster_path}">
                <h3 class="titulo">${title}</h3>
                <p><b>Código:</b> <span class="codigo">${id}</span><br>
                <b>Título original:</b> ${original_title}<br>
                <b>Idioma original:</b> ${original_language}<br>
                <b>Año:</b> ${release_date}<br>
                <b>Resumen:</b> ${overview}<br>
                <div class="video-container"></div>
                <button class="button radius medium eliminar-favorita">Eliminar de Favoritos</button>`;

                    contenedorFavoritas.appendChild(tarjeta);
                    await agregarVideoAPelicula(id, tarjeta.querySelector('.video-container'));
                }
            }

            mensajeNoPeliculas.style.display = 'none';
            mensajeError.style.display = 'none';
        } catch (error) {
            // Mostrar mensaje de error
            mensajeNoPeliculas.style.display = 'none';
            mensajeError.style.display = 'block';
        }
    }
}

async function obtenerPeliculaPorCodigo(codigo) {
    try {
        const apiKey = 'd2ec227d94b2f1aabdbc91b53a9fce0e';
        const language = 'es-ES';
        const url = `https://api.themoviedb.org/3/movie/${codigo}?api_key=${apiKey}&language=${language}`;
        const response = await fetch(url);
        const pelicula = await response.json();
        return pelicula;
    } catch (error) {
        console.error('Error al obtener la película:', error);
        return null;
    }
}

// Función para agregar video a la tarjeta de la película
async function agregarVideoAPelicula(codigo, contenedorVideo) {
    const apiKey = 'd2ec227d94b2f1aabdbc91b53a9fce0e';
    const videoUrl = `https://api.themoviedb.org/3/movie/${codigo}/videos?api_key=${apiKey}`;

    try {
        const response = await fetch(videoUrl);
        const data = await response.json();
        const video = data.results[0];

        if (video) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${video.key}`;
            iframe.setAttribute('width', '300');
            iframe.setAttribute('height', '200');
            contenedorVideo.appendChild(iframe);
        }
    } catch (error) {
        console.error('Error al obtener el video:', error);
    }
}

// Función para eliminar una película de la lista de favoritos
function eliminarPeliculaFavorita(codigo) {
    const peliculasFavoritas = obtenerPeliculasFavoritas();
    const indice = peliculasFavoritas.indexOf(codigo);

    if (indice !== -1) {
        peliculasFavoritas.splice(indice, 1);
        localStorage.setItem('FAVORITOS', JSON.stringify(peliculasFavoritas));
        mostrarPeliculasFavoritas();
    }
}

// Agregar evento de clic a través de la delegación de eventos para eliminar películas desde el botón "Eliminar de Favoritos"
const contenedorFavoritas = document.getElementById('contenedorFavoritas');
contenedorFavoritas.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-favorita')) {
        const tarjeta = event.target.closest('.favorita');
        const codigo = parseInt(tarjeta.querySelector('.codigo').textContent);
        eliminarPeliculaFavorita(codigo);
    }
});

// Mostrar las películas favoritas al cargar la página
mostrarPeliculasFavoritas();