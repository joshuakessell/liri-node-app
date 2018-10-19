require('dotenv').config();
const fs = require('fs');
const request = require('request');
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const spotify = new Spotify(keys.spotify);
const liri = process.argv;
let promise = false;
let term = '';

console.log(liri);


if (liri[2]==="do-what-it-says"){
    function runLiri(liri, callback) {
    fs.readFile("./random.txt", "utf8", function (err, data) {
        if(err) {
            throw err;
        }
        let text = data;
        text = text.replace("\"", "");
        text = text.replace("\"", "");
        text = text.replace(",", " ");
        text = text.split(" ");
        console.log(text);
        for (let i=0; i<text.length; i++){
            liri[i+2] = text[i];
        }
    });
    callback();
    }
}

runLiri(liri, function(){
    switch(liri[2]){
        case "concert-this":
            let concerts;
            term = "";
            for (let i = 3; i < liri.length; i++) {
                term += (liri[i]);
            }
            request.get(`https://rest.bandsintown.com/artists/${term}/events?app_id=codingbootcamp`, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    concerts = JSON.parse(body);
                    for (i = 0; i < 5; i++) {
                        let date = new Date(concerts[i].datetime);
                        var options = {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        };
                        console.log(concerts[i].venue.name + ", " + concerts[i].venue.city + " -- " + date.toLocaleDateString('en-US', options));
                    }
                }
            });

        case 'spotify-this-song':
            term = "";
            for (let i = 3; i < liri.length; i++) {
                term += (liri[i]);
                term += " ";
            }
            if (term===""){
                term="Whats my age again";
            }
            spotify.search({
                type: 'track',
                query: term.trim(),
                })
                .then(function (response){
                    let track=response.tracks.items[0];
                    console.log("Artist:  " + track.artists[0].name);
                    console.log("Track:  " + track.name);
                    console.log("Link to Spotify:  " + track.href);
                    console.log("Album: " + track.album.name);
                })
                .catch(function (err) {
                    console.log(err);
                });


        case "movie-this":
            term = "";
            for (let i = 3; i < liri.length; i++) {
                term += (liri[i]);
            }
            if(term===""){
                term="Mr. Nobody";
            }
            request.get(`http://www.omdbapi.com/?apikey=trilogy&t=${term}`, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let movieInfo = JSON.parse(body);
                    console.log("Title:  " + movieInfo.Title);
                    console.log("Release Date:  " + movieInfo.Released);
                    console.log("IMDB Rating:  " + movieInfo.imdbRating);
                    console.log(movieInfo.Ratings[1]);
                    console.log("Languages:  " + movieInfo.Language);
                    console.log("Plot:  " + movieInfo.Plot);
                    console.log("Actors:  " + movieInfo.Actors);
                }else if (error){
                    throw error;
                }
            });
    }
});

