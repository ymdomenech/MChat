$(document).ready(function(){
	var socket = io.connect('http://localhost:3000');
	var buildMessage= function(){
		var obj = {			
			"nombre_dest":$("#nombre_dest").val(),
			"mensaje":$("#mensaje").val()			
		}
		return JSON.stringify(obj);
	}
	  socket.on('serverMessage', function (data) {
	    var textarea = $("#mensajes").val()+"\n"+data;
	    $("#mensajes").val(textarea);    
	  });
	  var sendHandler = function(e){
		  e.preventDefault();
		  //set user
		  
		  
		  socket.emit('clientMessage', buildMessage());
		  $("#mensaje").val("");		  

	  }
	  $("#chat_btn").click(sendHandler);
	  $("#mensaje").keydown(function(e){
		  if(e.keyCode==13){
			  sendHandler(e);
		  }
	  });	
	  $("#nombre").change(function(){
		 socket.emit('login', $(this).val());
		  
	  });
});
  