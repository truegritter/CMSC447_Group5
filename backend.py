import requests

url = "https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&sort_by=popularity.desc&without_genres=animation"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDE1YWRiZjAzM2JiZTBmZjVkM2E4YTk5M2Y3NTgwNSIsIm5iZiI6MTcyODA3MDM2NC4xNjE3NjIsInN1YiI6IjY3MDA0MGU4YzlhMTBkNDZlYTdjZTI2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ALw111-0iTaOBTnDpnOlAWVpX7KeXeYot0hfrX3lY_E"
}

response = requests.get(url, headers=headers)

print(response.text)