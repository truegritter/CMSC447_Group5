document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('movie-main');
    const relatedContainer = document.getElementById('related-movies');

    // Fetch main movie details from localStorage
    const mainMovieDetails = JSON.parse(localStorage.getItem('selectedMovieDetails'));
    const relatedMovies = JSON.parse(localStorage.getItem('movieResults'));

    // Display main movie details
    if (mainMovieDetails) {
        // poster
        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${mainMovieDetails.poster_path}`;
        poster.alt = `${mainMovieDetails.title} Poster`;
        poster.classList.add('origin-movie-poster');

        // title
        const title = document.createElement('div');
        title.textContent = mainMovieDetails.title;
        title.classList.add('origin-movie-title');

        // description
        const description = document.createElement('div');
        description.textContent = mainMovieDetails.overview;
        description.classList.add("origin-movie-description");

        // title and description container
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('origin-movie-info');
        infoContainer.appendChild(title);
        infoContainer.appendChild(description);

        // Append poster and title together in the main container
        mainContainer.appendChild(poster);
        mainContainer.appendChild(infoContainer);

        // Fetch related movies (similar movies)
        fetchRelatedMovies(mainMovieDetails.id);

    } else {
        mainContainer.textContent = 'No movie details found.';
    }
});

// Fetch related movies (recommendations) from the backend
function fetchRelatedMovies(movieId) {
    fetch(`/movie-recommendations?movie_id=${movieId}`)
        .then(response => response.json())
        .then(data => {
            const relatedMoviesContainer = document.getElementById('related-movies').querySelector('.related-movies-container');
            relatedMoviesContainer.innerHTML = ''; // Clear any previous related movies

            if (data.results && data.results.length > 0) {
                // Display up to 10 related movies
                data.results.slice(0, 10).forEach(movie => {
                    const relatedItem = document.createElement('div');
                    relatedItem.classList.add('related-movie-item');

                    const relatedPosterButton = document.createElement('button'); // Create a button for the poster
                    relatedPosterButton.classList.add('related-movie-button'); // Add a class for styling
                    const relatedPoster = document.createElement('img');
                    relatedPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    relatedPoster.alt = `${movie.title} Poster`;

                    const relatedTitle = document.createElement('h3');
                    relatedTitle.textContent = movie.title;

                    // Add event listener to the button to navigate to the result page for this movie
                    relatedPosterButton.addEventListener('click', () => {
                        resultPage(movie.id, movie.title); // Use the resultPage function to fetch details
                    });

                    // Append poster to the button, and button to the related movie item
                    relatedPosterButton.appendChild(relatedPoster);
                    relatedItem.appendChild(relatedPosterButton);
                    relatedItem.appendChild(relatedTitle);

                    // Append the related movie item to the container
                    relatedMoviesContainer.appendChild(relatedItem);
                });
            } else {
                relatedContainer.textContent = 'No related movies found.';
            }
        })
        .catch(error => {
            console.error('Error fetching related movies:', error);
            relatedContainer.textContent = 'Failed to load related movies.';
        });
}

// Fetch the results page
function resultPage(movieId, movieTitle) {
    fetch(`/movie-details?movie_id=${movieId}`)
        .then(response => response.json())
        .then(data => {
            // Store the movie details and title
            localStorage.setItem('selectedMovieDetails', JSON.stringify(data));
            localStorage.setItem('movieTitle', movieTitle);

            // Push the new state into the history stack
            const state = {
                movieId: movieId,
                movieTitle: movieTitle
            };
            window.history.pushState(state, movieTitle, `?movie_id=${movieId}`);

            // Redirect to the result page
            window.location.href = 'result.html';
        })
        .catch(error => console.error('Error fetching result page:', error));
}

// Handle back button click
function goBack() {
    window.history.back(); // Navigate to the previous state in the history stack
}

// Handle state change when navigating through the history stack
window.addEventListener('popstate', (event) => {
    if (event.state) {
        const movieId = event.state.movieId;
        const movieTitle = event.state.movieTitle;
        
        // Use the movieId and movieTitle to fetch movie details and display them again
        fetch(`/movie-details?movie_id=${movieId}`)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('selectedMovieDetails', JSON.stringify(data));
                localStorage.setItem('movieTitle', movieTitle);
                window.location.href = 'result.html';
            })
            .catch(error => console.error('Error fetching result page on popstate:', error));
    }
});
