//API call
var Clarifai = require('clarifai');
var app = new Clarifai.App(
  'LzXEFU2gsfodIIjTO5YqNVqUvFRmJUkFYrep89bb',
  'VgVrrKfTFrFFVDTFVqD0EwDdHnqtku-q6IAcb1KD'
);
var API_KEY = '3508192-a3f9ba87aae26460abf2d2130';

//Globals
var winners = [];
var destination = "";
var score = 0;
var clicks = 0;
var countDown = 150;
var displayTimer;
var startingWords = ["rodent", "nature", "bird", "beach", "pizza", "tree", "boat", "waterfall", "flower", "sunset", "car", "crowd", "happy", "eggs"];

$(function(){
  ////timer functions
  var updateTimer = function(){
    if(countDown === 0){
      restartGame();
      alert("Time's Up! Game Over.");
    }
    else{
      countDown -= 1;
      $("#timer").text(countDown + " seconds");
    }
  };
  var start = function(){
    clearInterval(displayTimer);
    displayTimer = setInterval(updateTimer, 1000);
    $(".pathBox").empty();
    $(".resultImages").empty();
    $('.startButton').toggle();
  };

  //In-game functions
  var restartGame = function(){
    clicks = 0;
    countDown = 150;
    startTag = "";
    endTag = "";
    clearInterval(displayTimer);
    $(".imgBox").css("background-image", "none");
    $("#timer").html("");
    $("#clicks").html("");
    $(".pathBox").empty();
    $(".endTag").html("");
    $(".resultImages").empty();
    $(".resultImages").append("<h3>Welcome to the Telephoto Game. The object of the game is to get from the photo on the left to the photo on the right by clicking on the photos below to show more similar photos. Like the old game Telephone, things might get kind of mixed up in the middle!</h3>");
    $('.startButton').toggle();
  };
  var updateScores = function(){
    $(".scoresList").empty();
    // winners.sort(keysrt('score'));

    winners.forEach(function(score){
      $('.scoresList').append("<li>"+score.name + " " + score.score+"</li>");
    });
  };
  var displayClicks = function(){
    clicks +=1;
    $("#clicks").text(clicks);
    if(clicks === 15){
      restartGame();
      alert("Click Limt Reached! Game Over.");
    }
  };

  var playerWins = function(url, tag){
    $(".winBox").css("background-image", "url("+ url +")");
    score = (20-clicks)* countDown;
    var playerName = prompt("You Win! Enter your name:");
    var playerResult = {"score":score, "name":playerName};
    winners.push(playerResult);

  };
  //Begin Game
  $(".startButton").click(function(){
    //start timer and hide button
    start();
    //select start and end point words
    var random1 = Math.floor(Math.random() * (startingWords.length ));
    var random2 = Math.floor(Math.random() * (startingWords.length));
    while(random1 === random2){
      random2 = Math.floor(Math.random() * (startingWords.length));
    }
    var startTag = startingWords[random1];
    var endTag = startingWords[random2];
    destination = endTag;
    console.log(random1 +" "+ random2 + startTag + endTag);
    $(".endTag").text('->'+ endTag);

    //Fetch initial photo
    var URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(startTag);
    $.getJSON(URL, function(data){
      var initialPhoto = data.hits[0].webformatURL;
      $(".imgBox").css("background-image", "url("+ initialPhoto +")");
      getTags(initialPhoto);
    });
  });
  var getTags = function(url, bigUrl){
    displayClicks();
    app.models.predict(Clarifai.GENERAL_MODEL, url).then(
      function(response) {
        var tag1 = response.data.outputs[0].data.concepts[0].name;
        var tag2 = response.data.outputs[0].data.concepts[1].name;
        var tag3 = response.data.outputs[0].data.concepts[2].name;
        var tag4 = response.data.outputs[0].data.concepts[3].name;
        var tag5 = response.data.outputs[0].data.concepts[4].name;
        var tags = [tag1,tag2,tag3,tag4,tag5];
        $("#tag1").text(tag1);
        $("#tag2").text(tag2);
        $("#tag3").text(tag3);
        $("#tag4").text(tag4);
        $("#tag5").text(tag5);
        var tagsToString = tag1 + " " + tag2 + " "+tag3;
        var tagsToString2 = tagsToString.replace(/no person|panoramic|invertebrate|desktop|epicure|shelf|vector|illustration/gi, "");
          if (tags.includes(destination)){
            playerWins(bigUrl, destination);
            updateScores();
            restartGame();
          } else {
            likeImages(tagsToString2);
          }
      },
      function(err) {
        console.error(err);
      }
    );
  };

  var likeImages = function(imgTag){
    var URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(imgTag);
    $.getJSON(URL, function(data){
      console.log(data);
      if (parseInt(data.totalHits) > 0){
        $.each(data.hits, function(i, hit){
          $(".resultImages").append("<a><img class='resultImage' src='"+hit.previewURL+"'>");
          var scrollDown = function(){
            $("div.resultImages").scrollTop(90000);
          };
          var scrollTimer = setTimeout(scrollDown, 1000);
          $("img").last().click(function(){
            var url = $(this).attr("src");
            var bigUrl = hit.webformatURL;
            $(".pathBox").append("<img  src='"+url+"'>");
            getTags(url, bigUrl);
            $(this).addClass('clicked');
          });
        });
      } else {
        console.log('No hits');
      }
    });
  };
});
