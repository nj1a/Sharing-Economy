function toggleNameForm() {
   $('#login-screen').toggle();
}

function togglemessageWindow() {
  $('#main-message-screen').toggle();
}

// Pad n to specified size by prepending a zeros
function zeroPad(num, size) {
  var s = num + '';
  while (s.length < size) {
    s = '0' + s;
  }

  return s;
}

// Format the time specified in ms from 1970 into local HH:MM:SS
function timeFormat(msTime) {
  var d = new Date(msTime);
  return zeroPad(d.getHours(), 2) + ':' +
    zeroPad(d.getMinutes(), 2) + ':' +
    zeroPad(d.getSeconds(), 2) + ' ';
}

$(document).ready(function() {
  //setup 'global' variables first
  var socket = io.connect();
  var myRoomID = null;

  $('form').submit(function(event) {
    event.preventDefault();
  });

  $('#conversation').bind('DOMSubtreeModified',function() {
    $('#conversation').animate({
        scrollTop: $('#conversation')[0].scrollHeight
      });
  });

  $('#main-message-screen').hide();
  $('#errors').hide();
  $('#name').focus();
  $('#join').attr("disabled", "disabled");

  if ($('#name').val() === '') {
    $('#join').attr("disabled", "disabled");
  }

  //enter screen
  $('#nameForm').submit(function() {
    var name = $('#name').val();
    var device = 'desktop';
    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
      device = 'mobile';
    }
    if (name === '' || name.length < 2) {
      $('#errors').empty();
      $('#errors').append('Please enter a name longer than 3 characters');
      $('#errors').show();
    } else {
      socket.emit('start', name, device);
      toggleNameForm();
      togglemessageWindow();
      $('#msg').focus();
    }
  });

  $('#name').keypress(function(e){
    var name = $('#name').val();
    if(name.length < 2) {
      $('#join').attr("disabled", "disabled");
    } else {
      $('#errors').empty();
      $('#errors').hide();
      $('#join').removeAttr("disabled");
    }
  });

  //main message screen
  $('#messageForm').submit(function() {
    var msg = $('#msg').val();
    if (msg !== '') {
      socket.emit('send', new Date().getTime(), msg);
      $('#msg').val('');
    }
  });

  //"is typing" message
  var typing = false;
  var timeout;

  function timeoutFunction() {
    typing = false;
    socket.emit('typing', false);
  }

  $('#msg').keypress(function(e){
    if (e.which !== 13) {
      if (typing === false && myRoomID !== null && $('#msg').is(':focus')) {
        typing = true;
        socket.emit('typing', true);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 5000);
      }
    }
  });

  socket.on('isTyping', function(data) {
    if (data.isTyping) {
      if ($('#'+data.person+'').length === 0) {
        $('#updates').append('<li id="'+ data.person +'"><span class="text-muted"><small><i class="fa fa-keyboard-o"></i> ' + data.person + ' is typing.</small></li>');
        timeout = setTimeout(timeoutFunction, 5000);
      }
    } else {
      $('#'+data.person+'').remove();
    }
  });

  $('#showCreateRoom').click(function() {
    $('#createRoomForm').toggle();
  });

  $('#createRoomBtn').click(function() {
    var roomExists = false;
    var roomName = $('#createRoomName').val();
    socket.emit('check', roomName, function(data) {
      roomExists = data.result;
       if (roomExists) {
          $('#errors').empty();
          $('#errors').show();
          $('#errors').append('Room <i>' + roomName + '</i> already exists');
        } else {
        if (roomName.length > 0) { //also check for roomname
          socket.emit('createRoom', roomName);
          $('#errors').empty();
          $('#errors').hide();
          }
        }
    });
  });

  $('#rooms').on("click", ".joinRoomBtn", function() {
    var roomName = $(this).siblings('span').text();
    var roomID = $(this).attr('id');
    socket.emit('joinRoom', roomID);
  });

  $('#rooms').on("click", ".removeRoomBtn", function() {
    var roomName = $(this).siblings('span').text();
    var roomID = $(this).attr('id');
    socket.emit('removeRoom', roomID);
    $('#createRoom').show();
  });

  $('#leave').click(function() {
    var roomID = myRoomID;
    socket.emit('leaveRoom', roomID);
    $('#createRoom').show();
  });
  // htmkl css xml json js jquery (understand the syntax) untill week 10 (including security)


    socket.on('nameExists', (msg) => {
        $('#errors').empty();
        $('#errors').show();
        $('#errors').append(msg);
        toggleNameForm();
        togglemessageWindow();
    });

    socket.on('update', (msg) => {
        $('<li/>').text(msg).appendTo('#msgs');
    });

    socket.on('updateRoomCount', (data) => {
        $('#rooms').text('');
        var $count = $('<span/>').addClass('badge').text(data.count);
        var $list = $('<li/>').addClass('list-group-item active').text('Rooms');
        $count.appendTo($list);
        $list.appendTo('#rooms');

        if (!jQuery.isEmptyObject(data.rooms)) { // at least one room
            $.each(data.rooms, (idx, room) => {
                var $join = $('<button/>').addClass('joinRoomBtn btn btn-default btn-xs').text('Join');
                var $remove = $('<button/>').addClass('joinRoomBtn btn btn-default btn-xs').text('Remove');
                var $name = $('<span/>').text(room.name + ' ');
                $('<li/>').attr('id', idx).addClass('list-group-item')
                .append($name).append($join).append($remove).appendTo('#rooms');
            });
        } else {
            $('<li/>').addClass('list-group-item').text('Wait for you to create a room').appendTo('#rooms');
        }
    });

    socket.on('updatePeopleCount', (data) => {
        $('#people').empty();
        $("#people").append('<li class=\'list-group-item active\'>People online <span class=\'badge\'>'+data.count+'</span></li>');
        $.each(data.people, function(a, obj) {
        $("#people").append('<li class=\'list-group-item\'><span>' + obj.name + '</span> <i class=\'fa fa-'+obj.device+'\'></i> ');
        });
    });

socket.on('history', function(data) {
  if (data.length !== 0) {
    $('#msgs').append('<li><strong><span class="text-warning">Last 10 messages:</li>');
    $.each(data, function(data, msg) {
      $('#msgs').append('<li><span class="text-warning">' + msg + '</span></li>');
    });
  } else {
    $('#msgs').append('<li><strong><span class="text-warning">No past messages in this room.</li>');
  }
});





  socket.on('message', function(msTime, person, msg) {
    $('#msgs').append('<li><strong><span class="text-success">' + timeFormat(msTime) + person.name + '</span></strong>: ' + msg + '</li>');
    //clear typing field
     $('#'+person.name+'').remove();
     clearTimeout(timeout);
     timeout = setTimeout(timeoutFunction, 0);
  });



  socket.on('sendRoomID', function(data) {
    myRoomID = data.id;
  });

  socket.on('disconnect', function(){
    $('#msgs').append('<li><strong><span class="text-warning">The server is not available</span></strong></li>');
    $('#msg').attr('disabled', 'disabled');
    $('#send').attr('disabled', 'disabled');
  });

});
