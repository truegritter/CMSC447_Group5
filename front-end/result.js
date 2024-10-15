document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('results');
    const movieResults = JSON.parse(localStorage.getItem('movieResults'));

    if (movieResults) {
        movieResults.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');

            const title = document.createElement('h3');
            title.textContent = movie.title;
            movieElement.appendChild(title);

            const poster = document.createElement('img');
            poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            movieElement.appendChild(poster);

            const overview = document.createElement('p');
            overview.textContent = movie.overview;
            movieElement.appendChild(overview);

            resultsContainer.appendChild(movieElement);
        });
    } else {
        resultsContainer.textContent = 'No results found.';
    }
});