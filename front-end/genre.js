document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('Movie Details');
    const movieResults = JSON.parse(localStorage.getItem('movieResults'));
    const currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    const genreId = localStorage.getItem('genreId');

    // Get the selected genre from localStorage and display it
    const genreHeading = document.getElementById('genreName');
    const selectedGenre = localStorage.getItem('selectedGenre');
    
    if (selectedGenre) {
        genreHeading.textContent = `${selectedGenre} Genre Results (Page ${currentPage})`; // Display genre name with page
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
            posterContainer.onclick = () => resultPage(movie.genreId, movie.genreName, movie.movieId, movie.movie); // Use the movie ID for redirection

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

        // Create pagination controls
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination-container');

        // "Previous Page" button
        const previousPageButton = document.createElement('button');
        previousPageButton.textContent = 'Previous Page';
        previousPageButton.classList.add('previous-page');
        previousPageButton.onclick = () => {
            const previousPage = currentPage - 1;
            if (previousPage > 0) { // Ensure we don't go below page 1
                fetchPreviousPage(genreId, selectedGenre, previousPage);
            }
        };

        // Set the visibility of the Previous button
        if (currentPage > 1) {
            previousPageButton.style.display = 'inline'; // Show the button
        } else {
            previousPageButton.style.display = 'none'; // Hide the button if on page 1
        }

        // Page number display
        const pageNumberDisplay = document.createElement('span');
        pageNumberDisplay.textContent = `Page ${currentPage}`;
        pageNumberDisplay.classList.add('page-number-display');

        // "Next Page" button
        const nextPageButton = document.createElement('button');
        nextPageButton.textContent = 'Next Page';
        nextPageButton.classList.add('next-page');
        nextPageButton.onclick = () => {
            const nextPage = currentPage + 1;
            fetchNextPage(genreId, selectedGenre, nextPage);
        };

        // Append previous button, page number display, and next button to pagination container
        paginationContainer.appendChild(previousPageButton);
        paginationContainer.appendChild(pageNumberDisplay);
        paginationContainer.appendChild(nextPageButton);

        // Add pagination controls to the results container
        resultsContainer.appendChild(paginationContainer);
    } else {
        resultsContainer.textContent = 'No results found.';
    }
});

// Fetch the results page
function resultPage(genreId, genreName, movieId, movie) {
    window.location.href = 'index.html';
}

// Fetch the previous page of movies
function fetchPreviousPage(genreId, genreName, page) {
    fetch(`/genre-search?genre=${genreId}&currentPage=${page}`) // Pass currentPage as a parameter
        .then(response => response.json())
        .then(data => {
            // Store the new movie results and the updated page number in localStorage
            localStorage.setItem('movieResults', JSON.stringify(data.results));
            localStorage.setItem('currentPage', page); // Save new current page
            window.location.href = 'genre.html'; // Reload the page to display the previous set of results
        })
        .catch(error => console.error('Error fetching previous page:', error));
}

// Fetch the next page of movies
function fetchNextPage(genreId, genreName, page) {
    fetch(`/genre-search?genre=${genreId}&currentPage=${page}`) // Pass currentPage as a parameter
        .then(response => response.json())
        .then(data => {
            // Store the new movie results and the updated page number in localStorage
            localStorage.setItem('movieResults', JSON.stringify(data.results));
            localStorage.setItem('currentPage', page); // Save new current page
            window.location.href = 'genre.html'; // Reload the page to display the next set of results
        })
        .catch(error => console.error('Error fetching next page:', error));
}