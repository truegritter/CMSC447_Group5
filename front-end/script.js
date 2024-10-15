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
        button.onclick = () => getMoviesByGenre(genre.id);
        genreButtonsContainer.appendChild(button);
    });
});

function getRandomMovie() {
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    fetch(`/genre-search?genre=${randomGenre.id}`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('movieResults', JSON.stringify(data.results));
            window.location.href = 'result.html';
        });
}

function getMoviesByGenre(genreId) {
    fetch(`/genre-search?genre=${genreId}`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('movieResults', JSON.stringify(data.results));
            window.location.href = 'result.html';
        });
}

function searchMovie() {
    const query = document.getElementById('search').value;
    fetch(`/title-search?title=${query}`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('movieResults', JSON.stringify(data.results));
            window.location.href = 'result.html';
        });
}
