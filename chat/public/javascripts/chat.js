$(document).ready(function(){
  $("#postMessage").click(function(){
      var myobj = {Name:$("#name").val(),Message:$("#message").val()};
      jobj = JSON.stringify(myobj);
      $("#json").text(jobj);
      var url = "chat";
      $.ajax({
      url:url,
      type: "POST",
      data: jobj,
      contentType: "application/json; charset=utf-8",
      success: function(data,textStatus) {
          $("#done").html(textStatus);
          $("#message").val("");
          }
      })
  });
  
   $("#deleteChat").click(function(){
    var url = "deleteall";
      $.ajax({
      url:url,
      type: "DELETE",
      contentType: "application/json; charset=utf-8",
      success: function(data,textStatus) {
          $("#doneDeleting").html(textStatus);
      }
      })
  });
  
    $("#getChat").click(function() {
    $.getJSON('chat', function(data) {
      console.log(data);
      var everything = "<ul>";
      for(var message in data) {
        com = data[message];
        everything += "<li>" + com.Name + ": " + com.Message + "</li>";
      }
      everything += "</ul>";
      $("#chat").html(everything);
    })
  });
  
   $("#getUserChat").click(function() {
      var myobj = {Name:$("#username").val()};
      jobj = JSON.stringify(myobj);
      var url = "userchat";

      $.ajax({
      url:url,
      type: "POST",
      data: jobj,
      contentType: "application/json; charset=utf-8",
      success: function(data,textStatus) {
          console.log(data);
          var everything = "<ul>";
          for(var message in data) {
            com = data[message];
            everything += "<li>" + com.Name + ": " + com.Message + "</li>";
          }
          everything += "</ul>";
          $("#usercomments").html(everything);
      }
      })
  });
  
  
});

