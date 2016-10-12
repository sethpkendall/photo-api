var Clarifai = require('clarifai');
var app = new Clarifai.App(
  'LzXEFU2gsfodIIjTO5YqNVqUvFRmJUkFYrep89bb',
  'VgVrrKfTFrFFVDTFVqD0EwDdHnqtku-q6IAcb1KD'
);


var result;
$(function(){
  $("#submit_button").click(function(){
    var url = $("#url").val();
    console.log(url);
    app.models.predict(Clarifai.GENERAL_MODEL, url).then(
      function(response) {
        result = response;
        console.log(response);
        var sample_output = response.data.outputs[0].data.concepts[0].name;
        console.log(sample_output);
      },
      function(err) {
        console.error(err);
      }
    );
  });
});
