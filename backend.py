import requests
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

HEADERS = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDE1YWRiZjAzM2JiZTBmZjVkM2E4YTk5M2Y3NTgwNSIsIm5iZiI6MTcyODA3MDM2NC4xNjE3NjIsInN1YiI6IjY3MDA0MGU4YzlhMTBkNDZlYTdjZTI2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ALw111-0iTaOBTnDpnOlAWVpX7KeXeYot0hfrX3lY_E"
}

app.mount("/", StaticFiles(directory="front-end", html=True), name="front-end")

#Route /genre-search?genre={int} (See list below)
@app.get("/genre-search")
async def genre_search(genre: int):
    url = f"https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&with_genres={genre}"
    response = requests.get(url, headers=HEADERS)
    return response.json()

#Route /title-search?title={str}
@app.get("/title-search")
async def title_search(title: str):
    url = f"https://api.themoviedb.org/3/search/movie?include_adult=true&query={title}"
    response = requests.get(url, headers=HEADERS)
    return response.json()

#Route /random
@app.get("/random")
async def random():
    url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc"
    response = requests.get(url, headers=HEADERS)
    return response.json()

#Needed functions for the backend
#https://developer.themoviedb.org/reference/intro/getting-started

#FastAPI Docs
#https://fastapi.tiangolo.com/

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