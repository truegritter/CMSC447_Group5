const genres = [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" },
    { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" },
    { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
];

document.addEventListener('DOMContentLoaded', () => {
    const genreButtonsContainer = document.getElementById('genre-buttons');
    genres.forEach(genre => {
        const button = document.createElement('button');
        button.textContent = genre.name;
        button.onclick = () => getMoviesByGenre(genre.id, genre.name);
        genreButtonsContainer.appendChild(button);
    });
});

function getRandomMovie() {
    fetch(`/random`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('movieResults', JSON.stringify(data.results));
            window.location.href = 'confirmation.html';
        });
}

function getMoviesByGenre(genreId, genreName) {
    fetch(`/genre-search?genre=${genreId}`)
        .then(response => response.json())
        .then(data => {
            // Store the movie results and the selected genre in localStorage
            localStorage.setItem('movieResults', JSON.stringify(data.results));
            localStorage.setItem('selectedGenre', genreName); // Save genre name
            localStorage.setItem('currentPage', page = 1); // Save current page
            localStorage.setItem('genreId', genreId); // Save genreId for pagination
            window.location.href = 'genre.html'; // Navigate to the genre page
        })
        .catch(error => console.error('Error fetching movies:', error));
}

function searchMovie() {
    const query = document.getElementById('search').value;
    fetch(`/title-search?title=${query}`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('movieResults', JSON.stringify(data.results));
            window.location.href = 'confirmation.html';
        });
}