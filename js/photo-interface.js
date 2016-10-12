var Clarifai = require('clarifai');
var app = new Clarifai.App(
  'LzXEFU2gsfodIIjTO5YqNVqUvFRmJUkFYrep89bb',
  'VgVrrKfTFrFFVDTFVqD0EwDdHnqtku-q6IAcb1KD'
);



$(function(){
  $("#submit_button").click(function(){
    var url = $("#url").val();
    console.log(url);
    $("#inputImage").attr("src", url);
    app.models.predict(Clarifai.GENERAL_MODEL, url).then(
      function(response) {
        console.log(response);
        $("#tag1").text(response.data.outputs[0].data.concepts[0].name);
        $("#tag2").text(response.data.outputs[0].data.concepts[1].name);
        $("#tag3").text(response.data.outputs[0].data.concepts[2].name);
        $("#tag4").text(response.data.outputs[0].data.concepts[3].name);
        $("#tag5").text(response.data.outputs[0].data.concepts[4].name);
      },
      function(err) {
        console.error(err);
      }
    );
  });
});
