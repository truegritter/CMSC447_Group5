document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('Movie Details');
    const movieResults = JSON.parse(localStorage.getItem('movieResults'));

    const genreHeading = document.getElementById('genreName');
    const selectedGenre = localStorage.getItem('selectedGenre');
    
    if (selectedGenre) {
        genreHeading.textContent = `${selectedGenre} Movie Results`;
    }

    if (movieResults) {
        const movieGrid = document.createElement('div');
        movieGrid.classList.add('movie'); // Add a grid container

        movieResults.forEach(movie => {
            // Create poster container
            const posterContainer = document.createElement('div');
            posterContainer.classList.add('poster-container');

            const button = document.createElement('button');
            const poster = document.createElement('img');
            poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            button.appendChild(poster);
            posterContainer.appendChild(button);

            // Create title container
            const titleContainer = document.createElement('div');
            titleContainer.classList.add('movie-title');
            const title = document.createElement('movie-title');
            title.textContent = movie.title;
            titleContainer.appendChild(title);

            // Append poster and title in alternating columns
            movieGrid.appendChild(posterContainer); // Poster goes in columns 1 and 3
            movieGrid.appendChild(titleContainer);  // Title goes in columns 2 and 4
        });

        resultsContainer.appendChild(movieGrid); // Add the movie grid to the results container
    } else {
        resultsContainer.textContent = 'No results found.';
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const movieButton = document.getElementById("movie-title")
});
