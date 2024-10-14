import requests
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder='front-end')

HEADERS = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDE1YWRiZjAzM2JiZTBmZjVkM2E4YTk5M2Y3NTgwNSIsIm5iZiI6MTcyODA3MDM2NC4xNjE3NjIsInN1YiI6IjY3MDA0MGU4YzlhMTBkNDZlYTdjZTI2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ALw111-0iTaOBTnDpnOlAWVpX7KeXeYot0hfrX3lY_E"
}

# Serve static files for the front-end
@app.route('/')
@app.route('/<path:path>')
def serve_static_files(path='index.html'):
    return send_from_directory(app.static_folder, path)

# Route /genre-search?genre={int}
@app.route("/genre-search", methods=["GET"])
def genre_search():
    genre = request.args.get('genre')
    url = f"https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&sort_by=popularity.desc&with_genres={genre}"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())

# Route /title-search?title={str}
@app.route("/title-search", methods=["GET"])
def title_search():
    title = request.args.get('title')
    url = f"https://api.themoviedb.org/3/search/movie?include_adult=true&original_language=en&query={title}"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())

# Route /random
@app.route("/random", methods=["GET"])
def random():
    url = f"https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&sort_by=popularity.desc"
    response = requests.get(url, headers=HEADERS)
    return jsonify(response.json())

# Route /test
@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Hello World"})

# Run the app
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000)

#Needed functions for the backend
#https://developer.themoviedb.org/reference/intro/getting-started

#Title Search
#Genre Search
#Random Search
#Need to return basic details of the movies and poster link 

"""
{
  "genres": [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]
}
"""