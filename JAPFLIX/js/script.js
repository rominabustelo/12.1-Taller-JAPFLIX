const apiUrl = 'https://japceibal.github.io/japflix_api/movies-data.json';
let movies = [];

// Función para obtener los datos de las películas
async function fetchMovies() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error en la carga de datos');
        movies = await response.json();
    } catch (error) {
        console.error(error);
    }
}

// Función para buscar películas
function searchMovies() {
    const query = document.getElementById('inputBuscar').value.toLowerCase();
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genres.some(genre => genre.name.toLowerCase().includes(query)) ||
        movie.tagline.toLowerCase().includes(query) ||
        movie.overview.toLowerCase().includes(query)
    );
    displayMovies(filteredMovies);
}

// Función para mostrar las películas
function displayMovies(filteredMovies) {
    const lista = document.getElementById('lista');
    lista.innerHTML = ''; // Limpiar la lista anterior

    if (filteredMovies.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-danger">No se encontraron películas.</li>';
        return;
    }

    filteredMovies.forEach(movie => {
        const starRating = createStarRating(movie.vote_average);
        const movieItem = document.createElement('li');
        movieItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        movieItem.innerHTML = `
        <div class="movie-info">
            <div class="movie-details">
                <p class="title"><strong>${movie.title}</strong></p>
                <p class="mb-0">${movie.tagline}</p>
            </div>
            <span class="star-rating">${starRating}</span>
        </div>
        `;
        
        // Añadir evento de clic al movieItem
        movieItem.onclick = () => showMovieDetails(movie.id);
        lista.appendChild(movieItem);
    });
}


// Función para crear la representación de estrellas
function createStarRating(voteAverage) {
    const stars = Math.round(voteAverage / 2);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

// Función para mostrar detalles de la película
function showMovieDetails(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;

    // Rellenar información en el Offcanvas
    document.getElementById('offcanvasTopLabel').innerText = movie.title;
    document.getElementById('overview').innerText = movie.overview;
    document.getElementById('genres').innerText = movie.genres.map(genre => genre.name).join(', ');
    document.getElementById('releaseYear').innerText = movie.release_date.split('-')[0];
    document.getElementById('runtime').innerText = movie.runtime;
    document.getElementById('budget').innerText = `$${movie.budget.toLocaleString()}`;
    document.getElementById('revenue').innerText = `$${movie.revenue.toLocaleString()}`;

    // Mostrar el Offcanvas
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'));
    offcanvas.show();
}

// Inicializar la aplicación
document.getElementById('btnBuscar').addEventListener('click', searchMovies);
fetchMovies();

