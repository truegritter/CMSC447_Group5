document.addEventListener('DOMContentLoaded', () => {
    const resultsDiv = document.getElementById('results');

    document.getElementById('random').addEventListener('click', () => {
        fetch('/random')
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => console.error('Error:', error));
    });

    document.getElementById('title-search').addEventListener('click', () => {
        fetch('/title-search?title=spider')
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => console.error('Error:', error));
    });

    document.getElementById('genre-search').addEventListener('click', () => {
        fetch('/genre-search?genre=28')
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => console.error('Error:', error));
    });

    function displayResults(data) {
        resultsDiv.innerHTML = '';
        if (data.results && data.results.length > 0) {
            data.results.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie');
                movieDiv.innerHTML = `
                    <h2>${movie.title}</h2>
                    <p>${movie.overview}</p>
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster">
                `;
                resultsDiv.appendChild(movieDiv);
            });
        } else {
            resultsDiv.innerHTML = '<p>No results found.</p>';
        }
    }
});