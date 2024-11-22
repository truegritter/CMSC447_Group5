document.addEventListener('DOMContentLoaded', () => {
    // Check if dark mode was previously enabled in localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    const mainContainer = document.getElementById('movie-main');

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

        // release date
        const releaseDate = document.createElement('div');
        const date = new Date(mainMovieDetails.release_date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        releaseDate.textContent = `Release Date: ${date.toLocaleDateString(undefined, options)}`;
        releaseDate.classList.add('origin-movie-etxra-info');

        // user votes
        const userVotes = document.createElement('div');
        userVotes.textContent = `User Vote Average: ${mainMovieDetails.vote_average} | Total Votes: ${mainMovieDetails.vote_count}`;
        userVotes.classList.add('origin-movie-etxra-info');

        // Fetch extra data for the movie
        fetch(`/extra-data?movie_id=${mainMovieDetails.id}`)
            .then(response => response.json())
            .then(extraData => {
                // Age rating
                const ageRating = document.createElement('div');
                const usCertification = extraData.us_certifications.find(cert => cert.iso_3166_1 === 'US');
                if (usCertification) {
                    ageRating.textContent = `Rated: ${usCertification.release_dates[0].certification}`;
                } else {
                    ageRating.textContent = 'Rated: Not available';
                }
                ageRating.classList.add('origin-movie-etxra-info');

                // Director
                const director = document.createElement('div');
                if (extraData.director && extraData.director.length > 0) {
                    director.textContent = `Director: ${extraData.director[0].name}`;
                } else {
                    director.textContent = 'Director: Not available';
                }
                director.classList.add('origin-movie-etxra-info');

                // Writer
                const writer = document.createElement('div');
                if (extraData.writer && extraData.writer.length > 0) {
                    const writerNames = extraData.writer.map(writer => writer.name).join(', ');
                    writer.textContent = `Writers: ${writerNames}`;
                } else {
                    writer.textContent = 'Writers: Not available';
                }
                writer.classList.add('origin-movie-etxra-info');

                // Producer
                const producer = document.createElement('div');
                if (extraData.producer && extraData.producer.length > 0) {
                    const producerNames = extraData.producer.map(producer => producer.name).join(', ');
                    producer.textContent = `Producers: ${producerNames}`;
                } else {
                    producer.textContent = 'Producers: Not available';
                }
                producer.classList.add('origin-movie-etxra-info');

                infoContainer.appendChild(writer);
                infoContainer.appendChild(producer);

                // Actors
                const actors = document.createElement('div');
                if (extraData.first_5_actors && extraData.first_5_actors.length > 0) {
                    const actorNames = extraData.first_5_actors.map(actor => actor.name).join(', ');
                    actors.textContent = `Actors: ${actorNames}`;
                } else {
                    actors.textContent = 'Actors: Not available';
                }
                actors.classList.add('origin-movie-etxra-info');
                
                // Streaming options
                const streamingOptions = document.createElement('div');
                if (extraData.us_watch_link) {
                    const streamingLink = document.createElement('a');
                    streamingLink.href = extraData.us_watch_link;
                    streamingLink.textContent = 'Buy/Rent/Stream';
                    streamingLink.target = '_blank'; // Open link in a new tab
                    streamingOptions.appendChild(streamingLink);
                } else {
                    streamingOptions.textContent = 'Buy/Rent/Stream: No streaming options available.';
                }
                streamingOptions.classList.add('origin-movie-etxra-info');

                // Append releaseDate and userVotes to the info container
                infoContainer.appendChild(releaseDate);
                infoContainer.appendChild(userVotes);
               
                // Append other extra details to the info container
                infoContainer.appendChild(ageRating);
                infoContainer.appendChild(director);
                infoContainer.appendChild(writer);
                infoContainer.appendChild(producer);
                infoContainer.appendChild(actors);
                infoContainer.appendChild(streamingOptions);
            })
            .catch(error => console.error('Error fetching extra data:', error));

        // Append poster and infoContainer together in the main container
        mainContainer.appendChild(poster);
        mainContainer.appendChild(infoContainer);

        // Fetch related movies (similar movies)
        fetchRelatedMovies(mainMovieDetails.id);

    } 
    
    else {
        mainContainer.textContent = 'No movie details found.';
    }

    // Dark Mode toggle button
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
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
                relatedMoviesContainer.textContent = 'No related movies found.';
            }
        })
        .catch(error => {
            console.error('Error fetching related movies:', error);
            relatedMoviesContainer.textContent = 'Failed to load related movies.';
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