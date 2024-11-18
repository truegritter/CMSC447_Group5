console.log(JSON.parse(localStorage.getItem('movieResults')));


document.addEventListener('DOMContentLoaded', () => {

    // Check if dark mode was previously enabled in localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    const resultsContainer = document.getElementById('Movie Details');
    const movieResults = JSON.parse(localStorage.getItem('movieResults'));

    if (movieResults) {
        movieResults.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');

            const posterContainer = document.createElement('div'); // Container for poster
            posterContainer.classList.add('poster-container');

            const button = document.createElement('button'); // Create a button for the poster
            const poster = document.createElement('img');
            poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            button.appendChild(poster); // Set the image as a child of the button
            posterContainer.appendChild(button); // Append button to the poster container
            movieElement.appendChild(posterContainer); // Add poster container to movie element

            posterContainer.onclick = () => {
                resultPage(movie.id, movie.title);
            };

            const title = document.createElement('h3');
            title.textContent = movie.title;
            movieElement.appendChild(title); // Add title to movie element

            resultsContainer.appendChild(movieElement); // Append movie element to results container
        });
    } else {
        resultsContainer.textContent = 'No results found.';
    }
    // Dark Mode toggle button
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

});

function resultPage(movieId, movieTitle) {
    console.log(movieTitle);
    console.log(movieId);

    fetch(`/movie-details?movie_id=${movieId}`) 
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('selectedMovieDetails', JSON.stringify(data));
            localStorage.setItem('movieTitle', movieTitle);
            window.location.href = 'result.html';
        })
        .catch(error => console.error('Error fetching result page:', error));
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