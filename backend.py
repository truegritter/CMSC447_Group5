import requests
from flask import Flask, jsonify, request, send_from_directory
import random

app = Flask(__name__, static_folder='front-end')

HEADERS = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDE1YWRiZjAzM2JiZTBmZjVkM2E4YTk5M2Y3NTgwNSIsIm5iZiI6MTcyODA3MDM2NC4xNjE3NjIsInN1YiI6IjY3MDA0MGU4YzlhMTBkNDZlYTdjZTI2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ALw111-0iTaOBTnDpnOlAWVpX7KeXeYot0hfrX3lY_E"
}

GENRES = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37]

# Serve static files for the front-end
@app.route('/')
@app.route('/<path:path>')
def serve_static_files(path='index.html'):
    return send_from_directory(app.static_folder, path)

#include_adult=true Option to include adult content

# Route /genre-search?genre={int}
@app.route("/genre-search", methods=["GET"])
def genre_search():
    genre = request.args.get('genre')
    page = request.args.get('currentPage', 1)
    url = f"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres={genre}&page={page}"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())


# Route /title-search?title={str}
@app.route("/title-search", methods=["GET"])
def title_search():
    title = request.args.get('title')
    url = f"https://api.themoviedb.org/3/search/movie?include_adult=false&original_language=en&query={title}"
    response = requests.get(url, headers=HEADERS)
    data = response.json()
    # Filter out movies without a poster
    filtered_results = [movie for movie in data['results'] if movie.get('poster_path')]
    return jsonify({'results': filtered_results})


@app.route("/random", methods=["GET"])
def randomMovie():
    base_url = "https://api.themoviedb.org/3/discover/movie"

    while True:
        # Set parameters for the API call
        params = {
            "language": "en-US",
            "include_adult": "false",
            "vote_count.gte": 100,  # Only movies with 100+ votes
            "page": random.randint(1, 500)  # Random page between 1 and 500 for variety
        }

        # Make the API call with the random page parameter
        response = requests.get(base_url, headers=HEADERS, params=params)

        # Check if the response is successful and has results
        if response.status_code == 200:
            movies_data = response.json().get("results", [])

            # Filter out movies that do not have a poster_path
            movies_with_posters = [movie for movie in movies_data if movie.get("poster_path")]

            if movies_with_posters:
                # Pick a random movie from the list of movies that have posters
                movie_data = random.choice(movies_with_posters)
                return jsonify(movie_data)
            else:
                # If no movies with posters were found on this page, retry with a new page
                continue
        else:
            return jsonify({"error": "Failed to retrieve movies from API."}), response.status_code


@app.route("/movie-details", methods=["GET"])
def movie_details(): 
    movie_id = request.args.get('movie_id')
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?language=en-US"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())


# Route to get similar movies (Recommendations) based on a given movie_id
@app.route("/movie-recommendations", methods=["GET"])
def movie_recommendations():
    movie_id = request.args.get('movie_id')  # Get movie_id from query parameter
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/recommendations?language=en-US"
    response = requests.get(url, headers=HEADERS)

    # Check if the API response is successful
    if response.status_code == 200:
        recommendations_data = response.json().get("results", [])

        # Filter out movies that do not have a poster
        recommendations_with_posters = [
            movie for movie in recommendations_data if movie.get("poster_path")
        ]

        return jsonify({"results": recommendations_with_posters})
    else:
        return jsonify({"error": "Failed to retrieve movie recommendations from API."}), response.status_code


# Route to get extra data for a movie based on the movie_id
@app.route("/extra-data", methods=["GET"])
def extra_data():
    movie_id = request.args.get('movie_id')  # Get movie_id from query parameter
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?language=en-US&append_to_response=release_dates,credits"
    respExtraData = requests.get(url, headers=HEADERS)

    url = f"https://api.themoviedb.org/3/movie/{movie_id}/watch/providers"
    respWatchProviders = requests.get(url, headers=HEADERS)

    # Check if the API response is successful
    if respExtraData.status_code == 200:
        extraData = respExtraData.json()
        watchProviders = respWatchProviders.json()
        
        # Extract the link for US watch providers
        us_link = watchProviders.get('results', {}).get('US', {}).get('link', "No Options Available")
        
        # Extract US certifications
        us_certifications = [
            entry for entry in extraData.get('release_dates', {}).get('results', [])
            if entry.get('iso_3166_1') == 'US'
        ]
        
        # Extract first 5 actors
        cast = extraData.get('credits', {}).get('cast', [])
        first_5_actors = cast[:5]
        
        # Extract director, writer, and producer
        crew = extraData.get('credits', {}).get('crew', [])
        director = [member for member in crew if member.get('job') == 'Director']
        writer = [member for member in crew if member.get('job') == 'Writer']
        producer = [member for member in crew if member.get('job') == 'Producer']

        # Return the combined data
        return jsonify({
            'us_certifications': us_certifications,
            'first_5_actors': first_5_actors,
            'director': director,
            'writer': writer,
            'producer': producer,
            'us_watch_link': us_link
        })

# Run the app
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080)

#Needed functions for the backend
#https://developer.themoviedb.org/reference/intro/getting-started