document.addEventListener('DOMContentLoaded', () => {
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

            const title = document.createElement('h3');
            title.textContent = movie.title;
            movieElement.appendChild(title); // Add title to movie element

            resultsContainer.appendChild(movieElement); // Append movie element to results container
        });
    } else {
        resultsContainer.textContent = 'No results found.';
    }
});
