var Clarifai = require('clarifai');
var app = new Clarifai.App(
  'LzXEFU2gsfodIIjTO5YqNVqUvFRmJUkFYrep89bb',
  'VgVrrKfTFrFFVDTFVqD0EwDdHnqtku-q6IAcb1KD'
);
  var API_KEY = '3508192-a3f9ba87aae26460abf2d2130';

function updateModel(model) {
  model.deleteConcepts({"id": "no person"}).then(
    function(response) {
      // do something with response
    },
    function(err) {
      // there was an error
    }
  );
}

// app.models.initModel('aaa03c23b3724a16a56b629203edc62c').then(function(model) {
//   updateModel,
//   function(err) {
//     // there was an error
//   }
// });

$(function(){
  var score = 0;
  var clicks = 0;
  var countDown = 60;
  var displayTimer;

  var displayClicks = function(){
    clicks +=1;
    $("#clicks").text(clicks);
    if(clicks === 20){
      alert("game over");
    }
  }

  ////timer functions
  var updateTimer = function(){
    if(countDown === 0){
      clearInterval(displayTimer);
    }
    else{
      countDown -= 1;
      $("#timer").text(countDown + " seconds");
    }
  }
  var start = function(){
    displayTimer = setInterval(updateTimer, 1000);
  }
  start();

var playerWins = function(){
  $("#winBox").
}




  $("#submitButton").click(function(){
    var url = $("#url").val();
    $("#inputImage").attr("src", url);
    getTags(url);
  });
  var getTags = function(url){
    displayClicks();
    app.models.predict(Clarifai.GENERAL_MODEL, url).then(
      function(response) {
        console.log(response);
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
        var tagsToString2 = tagsToString.replace("no person", "");
        // other tags to remove
        // invertebrate
        if (tags.includes("pizza")){
          alert("You Win!");
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
      if (parseInt(data.totalHits) > 0){
        $.each(data.hits, function(i, hit){
          console.log("hello");
          $(".resultImages").append("<a><img class='resultImage' src='"+hit.previewURL+"'>");
          var scrollDown = function(){
            $("div.col-sm-8").scrollTop(90000);
          }
          var scrollTimer = setTimeout(scrollDown, 1000);
          $("img").last().click(function(){
            var url = $(this).attr("src");
            $(".imgBox").append("<img  src='"+url+"'>");
            console.log(url);
            getTags(url);
            $(this).addClass('clicked');



          });
        });
      }

      else
          console.log('No hits');
    });
  };
});
