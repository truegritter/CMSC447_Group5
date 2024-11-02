document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('movie-main');
    const relatedContainer = document.getElementById('related-movies');

    // Fetch main movie details from localStorage
    const mainMovieDetails = JSON.parse(localStorage.getItem('selectedMovieDetails'));
    const relatedMovies = JSON.parse(localStorage.getItem('movieResults'));

    // Display main movie details
    if (mainMovieDetails) {
        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${mainMovieDetails.poster_path}`;
        poster.alt = `${mainMovieDetails.title} Poster`;
        poster.classList.add('origin-movie-poster');

        const title = document.createElement('div');
        title.textContent = mainMovieDetails.title;
        title.classList.add('origin-movie-title');

        // Append poster and title together in the main container
        mainContainer.appendChild(poster);
        mainContainer.appendChild(title);
    } else {
        mainContainer.textContent = 'No movie details found.';
    }

    // Display up to 10 related movies in 2 rows of 5
    const relatedMoviesContainer = relatedContainer.querySelector('.related-movies-container');
    
    if (relatedMovies) {
        relatedMovies.slice(0, 10).forEach(movie => {
            const relatedItem = document.createElement('div');
            relatedItem.classList.add('related-movie-item');

            const relatedPoster = document.createElement('img');
            relatedPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            relatedPoster.alt = `${movie.title} Poster`;

            const relatedTitle = document.createElement('h3');
            relatedTitle.textContent = movie.title;

            relatedItem.appendChild(relatedPoster);
            relatedItem.appendChild(relatedTitle);
            relatedMoviesContainer.appendChild(relatedItem);
        });
    } else {
        relatedContainer.textContent = 'No related movies found.';
    }
});
