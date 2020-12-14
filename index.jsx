const connection = require("./src/config");
const express = require("express");
const movies = require("./movies");
const users = require("./users");

const port = 3000;
const app = express();

app.use(express.json()) // For JSON format

function logInfos(req, res, next) {
  console.log(`${req.method} request from ${req.hostname}`);
  next();
}

app.use(logInfos); 

// --- DELETE METHOD ---
// The ID is passed as a route parameter
app.delete("/api/users/:id", (req, res) => {
  const idUser = req.params.id; 
  connection.query("DELETE FROM users WHERE id = ?", [idUser], (err) => {
    // TODO send a response to the client (step 3)
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting an user");
    } else {
      res.status(200).send("🎉 User deleted!");
    }
  });
});

app.delete("/api/movies/:id", (req, res) => {
  const idMovie = req.params.id; 
  connection.query("DELETE FROM movies WHERE id = ?", [idMovie], (err) => {
    // TODO send a response to the client (step 3)
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting an user");
    } else {
      res.status(200).send("🎉 User deleted!");
    }
  });
});

// --- PUT METHOD ---
// This route will update a user in the DB
app.put("/api/users/:id", (req, res) => {
  // We get the ID from the url:
  const idUser = req.params.id;

  // We get the data from the req.body
  const newUser = req.body;
  console.log(idUser)
  console.log(newUser)
  // We send a UPDATE query to the DB
  connection.query(
    "UPDATE users SET ? WHERE id= ? ;",
    // "UPDATE users SET lastname=lastname, firstname=firstname, email=email WHERE id=idUser;",
    [newUser, idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else {
        res.status(200).send("User updated successfully 🎉");
      }
    }
  );
});

app.put("/api/movies/:id", (req, res) => {
  // We get the ID from the url:
  const idMovie = req.params.id;
  const title = req.params.title;
  const director = req.params.director;
  const year = req.params.year;
  const color = req.params.color;
  const duration = req.params.duration;

  // We get the data from the req.body
  const newMovie = req.body;
  
  // We send a UPDATE query to the DB
  connection.query(
    "UPDATE movies SET ? WHERE id= ? ;",
    [newMovie, idMovie, title, director, year, color, duration ],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a movie");
      } else {
        res.status(200).send("Movie updated successfully 🎉");
      }
    }
  );
});

// --- POST METHOD ---
app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES(?, ?, ?, ?, ?)",
    [title, director, year, color, duration], 
    (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error saving a movie");
          } else {
            res.status(200).send("Successfully saved");
          }
        }
    ); 
});

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email } = req.body;
  connection.query(
    "INSERT INTO users(firstname, lastname, email) VALUES(?, ?, ?)",
    [firstname, lastname, email], 
    (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error saving a user");
          } else {
            res.status(200).send("Successfully saved");
          }
        }
    ); 
});

// --- GET METHOD ---

app.get("/superMiddleware", (request, response, next) => {
  console.log("Hello middleware")
  next()
}, function (request, response) {
  response.send("Hello world");
})

app.get("/api", (request, response) => {
  console.log(request);
  response.send("Welcome to my favourite movie list");
});

app.get("/api/movies", (request, response) => {
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

app.get("/api/movies/:id", (request, response) => {
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

app.get("/api/movies/5", (request, response) => {
  console.log(request);
  response.send("Not found");
});

app.get("/api/search/", (request, response) => {
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

app.get("/api/users", (request, response) => {
  // console.log(request);
  // response.send("unauthorized");
  console.log("request ==> " +request);
  connection.query("SELECT * from users", (err, results) => {
    if (err) {
      response.status(500).send("Error retrieving data");
    } else {
      response.status(200).json(results);
    }
  });
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
