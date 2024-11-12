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
    return jsonify(response.json())

# Route /random
@app.route("/random", methods=["GET"])
def randomMovie():
    while True:
        randomId = random.randint(2, 999999)
        print(randomId)
        url = f"https://api.themoviedb.org/3/movie/{randomId}?language=en-US&include_adult=false"
        response = requests.get(url, headers=HEADERS)

        if response.status_code == 200:
            movie_data = response.json()
            if not movie_data.get("adult", False) and movie_data.get("poster_path"): # check that movie is not adult and that it has a poster
                return jsonify(movie_data)

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
    return jsonify(response.json())


# Run the app
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080)

#Needed functions for the backend
#https://developer.themoviedb.org/reference/intro/getting-started