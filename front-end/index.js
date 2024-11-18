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

    // Check if dark mode was previously enabled in localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    const genreButtonsContainer = document.getElementById('genre-buttons');
    genres.forEach(genre => {
        const button = document.createElement('button');
        button.textContent = genre.name;
        button.onclick = () => getMoviesByGenre(genre.id, genre.name);
        genreButtonsContainer.appendChild(button);
    });
    
    // Add event listener for the Enter key in the search input
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') { // Check if the pressed key is Enter
            event.preventDefault(); // Prevent the default form submission if it's inside a form
            searchMovie(); // Call the search function
        }
    });

    // Dark Mode toggle button
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});

// Function to get a random movie
function getRandomMovie(movieId) {
    fetch(`/random?movie_id=${movieId}`)
        .then(response => response.json())
        .then(data => {
            // Store the main movie details correctly in localStorage
            localStorage.setItem('selectedMovieDetails', JSON.stringify(data));
            // Redirect to the result page
            window.location.href = 'result.html';
        })
        .catch(error => console.error('Error getting movies:', error));
}

// Function to get movies by genre
function getMoviesByGenre(genreId, genreName) {
    fetch(`/genre-search?genre=${genreId}`)
        .then(response => response.json())
        .then(data => {
            // Store the movie results and the selected genre in localStorage
            localStorage.setItem('movieResults', JSON.stringify(data.results));
            localStorage.setItem('selectedGenre', genreName); // Save genre name
            localStorage.setItem('currentPage', 1); // Save current page
            localStorage.setItem('genreId', genreId); // Save genreId for pagination
            window.location.href = 'genre.html'; // Navigate to the genre page
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// Function to search for a movie
function searchMovie() {
    const query = document.getElementById('search').value;
    fetch(`/title-search?title=${query}`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('movieResults', JSON.stringify(data.results));
            window.location.href = 'confirmation.html';
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    
    // Check if dark mode is already active
    if (body.classList.contains('dark-mode')) {
        // If dark mode is active, remove the class and return to light mode
        body.classList.remove('dark-mode');
        // Remove dark mode from localStorage
        localStorage.setItem('darkMode', 'disabled');
    } else {
        // If dark mode is not active, add the class and apply dark mode styles
        body.classList.add('dark-mode');
        // Save dark mode to localStorage
        localStorage.setItem('darkMode', 'enabled');
    }
}