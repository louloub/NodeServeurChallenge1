// Express is already installed
const express = require("express");
// Array of movies
const movies = require("./movies");
// In codesandbox we need to use the default port which is 8080
const port = 8080;
const app = express();
const url = require("url");

app.get("/", (request, response) => {
  console.log(request);
  response.send("Welcome to my favourite movie list");
});

app.get("/movies", (request, response) => {
  console.log(request);
  response.status(200).json(movies);
});

app.get("/movies/:id", (request, response) => {
  console.log("request.url ==> " +request.url)
  console.log("request.params.id ==> " +request.params.id) 
  if (request.params.id > 2) {
    response.status(404)
    response.send("Not found");
  }
  const id = request.params.id
  response.status(200).json(movies[id]);
});

app.get("/movies/5", (request, response) => {
  console.log(request);
  response.send("Not found");
});

app.get("/search/", (request, response) => {
  console.log("request.query.maxDuration ==> " +request.query.maxDuration);
  const maxDuration = request.query.maxDuration;
  const result = movies.filter(movie => movie.duration <= maxDuration);
  console.log(result)
  if (result.length === 0){
    response.status(404)
    response.send("no movies found for this duration");
  } else {
    response.status(200).json(result);
  }
});

app.get("/users", (request, response) => {
  console.log(request);
  response.send("unauthorized");
});

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});
