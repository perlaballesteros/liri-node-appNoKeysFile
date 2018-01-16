var Keys=require("./keys.js");
var Twitter=require("twitter");
var Spotify = require('node-spotify-api');
var spotify= new Spotify(Keys.spotify);
var request = require("request");
var fs = require("fs");

var command=process.argv[2];

function Tweets(){
    
    var client = new Twitter(Keys.twitter);
    var numTweets=20;
    var params = {screen_name: 'Jane Doe'};

    client.get('statuses/user_timeline',params, function(error, tweets, response) {
        if (!error) {
            for(var i=0;i<numTweets;i++){
                console.log("-------------------------------");         
                console.log("When: "+tweets[i].created_at);
                console.log("Tweet: " + tweets[i].text);
            }
        }
    });
}

function spotifycall(song){
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var songArtist=data.tracks.items[0].artists[0].name;
        var songName=data.tracks.items[0].name;
        var songAlbum=data.tracks.items[0].album.name;
        var songLink=data.tracks.items[0].preview_url;
        console.log("*******************************");
        console.log("Artist: " +songArtist); 
        console.log("Song Name: " +songName);
        console.log("Album: " +songAlbum);   
        console.log("Spotify Link: " +songLink);
        console.log("*******************************");
    });
}

function SpotifyInfo(){
    var song=process.argv[3];

    if(command==="do-what-it-says"){
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
              return console.log(error);
            }
            var dataArr = data.split(",");
            var arg=dataArr[1];
            spotifycall(arg);
        });
    }
    else if (song==="" || song===undefined){
        song= "The Sign: Ace of Base";
        spotifycall(song);
    }  
    else {
        spotifycall(song);
    } 
}

function OmdbRequest(){
    var movie=process.argv[3];
    if(command==="do-what-it-says"){
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
              return console.log(error);
            }
            var dataArr = data.split(",");
            movie=dataArr[1];
        });
    }
    else if(movie===""||movie===undefined){
        movie="Mr. Nobody";
    }
    request("http://www.omdbapi.com/?t="+movie+"=&plot=short&apikey=40e9cece", function(error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country of Production: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        }
    });
}

function Random(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        var command2=dataArr[0];
        var arg=dataArr[1];
        Command(command2);
    });

}

function Command(command1){
    switch (command1){
        case "my-tweets":
            Tweets();
        break;
        case "spotify-this-song":
            SpotifyInfo();
        break;
        case "movie-this":
            OmdbRequest();
        break;
        case "do-what-it-says":
            Random();
        break;
    }
}
//RUN WHEN THE PROGRAM STARTS
Command(command);