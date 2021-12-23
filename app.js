// create an express app
const express = require("express")
const app = express()
var http = require("http");
var startComplimentJob = require('./job');

// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
  res.send("<h1>Compliment-a-day!</h1>")
})

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => {
        console.log("Server is running...");
        startComplimentJob.scheduler();

        setInterval(function() {
          http.get("http://compliment-a-day.herokuapp.com/");
      }, 300000); // every 5 minutes (300000)
    });