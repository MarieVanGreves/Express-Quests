const express = require("express");  
require("dotenv").config();

const app = express(); 

const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

app.use(express.json());

const port = process.env.APP_PORT ?? 5000; 

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");


//GET
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);

//LOGIN
app.post(
  "/api/login",
  usersHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

    app.use(verifyToken);

//POST 
const { validateMovie } = require("./validators.js");
app.post("/api/movies", validateMovie, movieHandlers.postMovie);
//POST 
const { validateUser } = require("./validators.js");
app.post("/api/users", validateUser, hashPassword, usersHandlers.postUsers);



//PUT
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.put("/api/users/:id", usersHandlers.updateUsers);

//DELETE
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", usersHandlers.deleteUsers);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
