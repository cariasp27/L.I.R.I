////////// Requires //////////
require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var keys = require("./key");
var axios = require("axios");
var moment = require("moment");
////////// Spotify //////////
var spotify = new Spotify(keys.spotify);
// grab input from node command line and assign to variables
var command = process.argv[2];
var input = process.argv.slice(3).join(" ");

////////// Functions for API Calls //////////
// OMDB API Object //
var omdb = {
  // method for making AXIOS API Call
    movthis: function (moviename){
        axios.get("https://www.omdbapi.com/?t="+ moviename +"&y=&plot=short&apikey=trilogy").then(
  function(response) {
    // assign response to variable for manipulation
    var mov = response.data;
    // Log pertinent info to console
    console.log("OMDB found...");
    console.log(mov.Title);
    console.log("Released in: "+ mov.Year);
    console.log("IMDB gave this movie a: " + mov.imdbRating);
    console.log("Rotten Tomatoes gave this movie a: " + mov.Ratings[1].Value);
    console.log("This movie was produced in: " + mov.Country);
    console.log(mov.Title + " is in : " + mov.Language);
    console.log(mov.Title +"'s plot: " + mov.Plot); 
    console.log(mov.Title +" stars: " + mov.Actors);
  }
);
    }
};
// Spotify API Object //
var spoti = {
    // method for making API Call
    spotthis: function (songname){
      spotify.search({ type: 'track', query: songname, limit: 1 }, function(err, data) {
        // error handling
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      // assign relevant info to variables for manipulation
      var title = data.tracks.items[0].name;
      var bndnme = data.tracks.items[0].album.artists[0].name;
      var bumname = data.tracks.items[0].album.name;
      var link = data.tracks.items[0].preview_url;
      // log info to the console
      console.log("Spotify found...");
      console.log(title + " by " + bndnme + " from " + bumname +"\nlink: " + link );
    
      });
    }
};
// BandsInTown API Object //
var bit = {
    // method for making AXIOS API Call // 
    conthis: function (bandname){
        axios.get("https://rest.bandsintown.com/artists/" + bandname + "/events?app_id=codingbootcamp").then(
            function(response) {
              // assign relevant info to variables for manipulation
              var vename = response.data[0].venue.name;
              var vencity = response.data[0].venue.city;
              var venloc = response.data[0].venue.country;
              var t = response.data[0].datetime;
              var time = moment(t).format("MM/DD/YYYY");
              // log info to console
              console.log("-------------------------------");
              console.log(bandname + " will next be at:");
              console.log("-------------------------------");
              console.log(vename + " in " + vencity + ", " + venloc + " on " + time);
            }
          );
    }
};

// switch case for handling input and running corresponding functions
switch(command){
    case "movie-this":
    if (!input){ omdb.movthis("Mr.Nobody")
  } else {omdb.movthis(input);
  };
    
    break;
    
    case "concert-this":
    bit.conthis(input);
    break;

    case "spotify-this-song":
    if(!input){spoti.spotthis("The Sign Ace of Base");
  }
    else {
    spoti.spotthis(input);
    }
    break;

    case "do-what-it-says":
    fs.readFile("random.txt", function (err, data){
      if (err){throw err}
      else{ spoti.spotthis(data)}
    })
    break;
};