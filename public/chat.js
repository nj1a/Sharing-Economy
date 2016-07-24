  var socket = io();
  var username = prompt('What\'s your username?');
    socket.emit('little_newbie', username);
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });