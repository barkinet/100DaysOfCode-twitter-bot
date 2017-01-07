/**
 * DEPENDENCIES
 */
var twit = require('twit'),
    config = require('./config'),
    uniqueRandomArray = require('unique-random-array');

var Twitter = new twit(config);

// use random array 
var queryString = uniqueRandomArray([
    '#100DaysOfCode',
    '#100daysofcode'
]);

// Console Welcome Msg
console.log('Welcome to #100DaysOfCode');

// RETWEET
// find latest tweets according to #100daysofcode
var retweet = function () {
  var params = {
    q: queryString(),
    result_type: 'recent',
    lang: 'en'
  };
  // for more parameters options, see: https://dev.twitter.com/rest/reference/get/search/tweets
  Twitter.get('search/tweets', params, function (err,data) {
    // if no errors
    if(!err){
      // grab ID of tweet to retweet
      var retweetId = data.statuses[0].id_str;
      // Tell Twitter to retweet
      Twitter.post('statuses/retweet/:id', {
        id: retweetId
      }, function (err,response) {
        // if error while retweet
        if(err){
          console.log('While Retweet. ERROR!...Maybe Duplicate Tweet');
        } else {
          console.log('Retweet. SUCCESS!');
        }

      });
    }
    // if unable to search a tweet
    else{
      console.log('Cannot Search Tweet. ERROR!');
    }
  });
};

retweet();
// retweet every 6 minutes
setInterval(retweet, 360000);

// FAVORITE ==============================
// find a random tweet using querySring and 'favorite' it
var favoriteTweet = function () {
  var params = {
    q          : queryString(),
    result_type: 'recent',
    lang       : 'en'
  };
  // for more parameters, see: https://dev.twitter.com/rest/reference

  // find a tweet
  Twitter.get('search/tweets', params, function (err,data) {
    // find tweets randomly
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);    //pick a random tweet

      //if random tweet is found
      if(typeof randomTweet != 'undefined'){
        // Tell Twitter to 'favorite' it
        Twitter.post('favorites/create', {id: randomTweet.id_str}, function (err,response) {
          // if error while 'favorite'
          if(err){
            console.log('Cannot Favorite. ERROR!');
          }
          else{
            console.log('Favorite Done. SUCCESS!');
          }
        });
      }
  });
};
// grab & 'favorite' a tweet ASAP program is running
favoriteTweet();
// 'favorite' a tweet every 12 minutes
setInterval(favoriteTweet, 720000);

// STREAM API for interacting with a USER =======
// set up a user stream
var stream = Twitter.stream('user');

// REPLY-FOLLOW BOT ============================
// what to do when someone follows you?
stream.on('follow', followed);

// ...trigger the callback
function followed(event) {
  console.log('Follow Event now RUNNING');
  // get USER's twitter handler (screen name)
  var name = event.source.name,
      screenName = event.source.screen_name;
  // function that replies back to every USER who followed for the first time
  tweetNow('@' + screenName + ' Thank you. What are you working on today?');
}

// function definition to tweet back to USER who followed
function tweetNow(tweetTxt) {
  var tweet = {
    status: tweetTxt
  };
  Twitter.post('statuses/update', tweet, function (err,data, response) {
    if(err){
      console.log("Cannot Reply to Follower. ERROR!");
    }
    else{
      console.log('Reply to follower. SUCCESS!');
    }
  });
}


function ranDom(arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
}

// REPLY-ON-DAY-X ============================
// 

// 
//  search twitter for all tweets containing the word 'banana' since July 11, 2011 
// 
var todayDate = new Date().toISOString().slice(0,10);
Twitter.get('search/tweets', { q: '"#100DaysOfCode" "Day 1" since:' + todayDate, count: 100 }, function(err, data, response) {
  console.log(data);
});

// var stream = T.stream('statuses/filter', { track: 'mango' })
 
// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })