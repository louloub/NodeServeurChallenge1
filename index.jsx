const connection = require("./src/config");
const express = require("express");
const movies = require("./movies");
const port = 3000;
const app = express();
const url = require("url");

app.get("/", (request, response) => {
  console.log(request);
  response.send("Welcome to my favourite movie list");
});

app.get("/movies", (request, response) => {
  console.log("request ==> " +request);
  // response.status(200).json(movies);
  connection.query("SELECT * from movies", (err, results) => {
    if (err) {
      response.status(500).send("Error retrieving data");
    } else {
      response.status(200).json(results);
    }
  });
});

app.get("/movies/:id", (request, response) => {
  console.log("request.url ==> " +request.url)
  console.log("request.params.id ==> " +request.params.id) 
  if (request.params.id > 5) {
    response.status(404)
    response.send("Not found");
  } else { 
    const id = request.params.id
    // response.status(200).json(movies[id]);
    connection.query(`SELECT * from movies WHERE id =${id}`, (err, results) => {
      if (err) {
        response.status(500).send("Error retrieving data");
      } else {
        response.status(200).json(results);
      }
    });
  }
  // const id = request.params.id
  // response.status(200).json(movies[id]);
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
    // response.status(200).json(result);
    connection.query(`SELECT * from movies WHERE duration <= ${maxDuration}`, (err, results) => {
      if (err) {
        response.status(500).send("Error retrieving data");
      } else {
        response.status(200).json(results);
      }
    });
  }
});

app.get("/users", (request, response) => {
  console.log(request);
  response.send("unauthorized");
});

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});
