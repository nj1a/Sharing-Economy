function prependZero(num) {
    var s = num + '';
    while (s.length < 2) {
        s = '0' + s;
    }
    return s;
}

$(document).ready(() => {
    var socket = io.connect();
    var currRoom = null;
    var typing = false;
    var timeoutId;

    function timeUp() {
        typing = false;
        socket.emit('typing', false);
    }

    $('form').submit((event) => {
        event.preventDefault();
    });

    $('#convo').bind('DOMSubtreeModified', () => {
        $('#convo').animate({
            scrollTop: $('#convo')[0].scrollHeight
        });
    });

    $('#main-message-screen').hide();
    $('#errors').hide();
    $('#name').focus();

    // limit the length of name
    if ($('#name').val() === '') {
        $('#join').attr("disabled", "disabled");
    }

    $('#name').keypress(() => {
        var name = $('#name').val();
        if(name.length < 3) {
            $('#join').attr("disabled", "disabled");
        } else {
            $('#errors').empty();
            $('#errors').hide();
            $('#join').removeAttr("disabled");
        }
    });


    $('#nameForm').submit(() => {
        var name = $('#name').val();
        var device = navigator.userAgent
            .match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) ?
            'mobile' : 'desktop';

        if (name === '' || name.length < 3) {
            $('#errors').empty();
            $('#errors').append('Please enter a name longer than 3 characters');
            $('#errors').show();
        } else {
            socket.emit('start', name, device);
            $('#first').toggle();
            $('#main-message-screen').toggle();
            $('#msg').focus();
        }
    });


    $('#messageForm').submit(() => {
        var $msg = $('#msg').val();
        if ($msg !== '') {
            socket.emit('send', new Date().getTime(), $msg);
            $('#msg').val('');
        }
    });

    $('#msg').keypress((e) => {
        if (e.which !== 13) { // not return
            if (!typing && currRoom && $('#msg').is(':focus')) {
                typing = true;
                socket.emit('typing', true);
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(timeUp, 1500);
            }
        }
    });

    $('#showCreateRoom').click(() => {
        $('#createRoomForm').toggle();
    });

    $('#createRoomBtn').click(() => {
        var nameExists = false;
        var roomName = $('#createRoomName').val();
        socket.emit('checkRoomName', roomName, (data) => {
            nameExists = data.result;
            if (nameExists) {
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

    // don't use arrow functions for the following two functions, as "this" 
    // keyword points to the code surrounding this function, which is not desired.
    $('#rooms').on("click", ".joinRoomBtn", function() {
        var roomID = $(this).parent().attr('id');
        socket.emit('joinRoom', roomID);
    });

    $('#rooms').on("click", ".removeRoomBtn", function() {
        var roomID = $(this).parent().attr('id');
        socket.emit('removeRoom', roomID);
        $('#createRoom').show();
    });

    $('#leave').click(() => {
        var roomID = currRoom;
        socket.emit('leaveRoom', roomID);
        $('#createRoom').show();
    });

    socket.on('nameExists', (msg) => {
        $('#errors').empty();
        $('#errors').show();
        $('#errors').append(msg);
        $('#first').toggle();
        $('#main-message-screen').toggle();
    });

    socket.on('update', (msg) => {
        $('#msgs').append('<li><span class="text-info">' + msg + '</span></li>');
    });

    socket.on('updateRoomCount', (data) => {
        $('#rooms').empty();
        var $count = $('<span/>').addClass('label label-success').text(data.count);
        var $list = $('<li/>').addClass('list-group-item list-group-item-success').text('Rooms');
        $count.appendTo($list);
        $list.appendTo('#rooms');

        if (data.count) { // at least one room
            $.each(data.rooms, (id, room) => {
                var $join = $('<button/>').addClass('joinRoomBtn btn btn-info btn-xs').text('Join');
                var $remove = $('<button/>').addClass('removeRoomBtn btn btn-danger btn-xs').text('Remove');
                var $name = $('<span/>').text(room.name + ' ');
                $('<li/>').attr('id', id).addClass('list-group-item')
                .append($name).append($join).append($remove).appendTo('#rooms');
            });
        } else {
            $('<li/>').addClass('list-group-item').text('Wait for you to create a room').appendTo('#rooms');
        }
    });

    socket.on('updatePeopleCount', (data) => {
        $('#people').empty();
        var $count = $('<span/>').addClass('label label-success').text(data.count);
        var $list = $('<li/>').addClass('list-group-item list-group-item-success').text('People');
        $count.appendTo($list);
        $list.appendTo('#people');
        
        $.each(data.people, (idx, user) => {
            var $name = $('<span/>').text(user.name + ' ');
            var $device = $('<i/>').addClass('fa fa-' + user.device);
            $('<li/>').attr('id', user.name).addClass('list-group-item').append($name).append($device).appendTo('#people');
        });
    });

    socket.on('isTyping', (data) => {
        if (data.isTyping) {
            if (!$('#'+ data.name + '_t').length) {
                $('<span/>').attr('id', data.name + '_t').addClass('text-muted').text(' is typing')
                .appendTo('#' + data.name);

                timeoutId = setTimeout(timeUp, 1500);
            }
        } else {
            $('#' + data.name + '_t').remove();
        }
    });

    socket.on('message', (msgTime, person, msg) => {
        // format time
        var d = new Date(msgTime);
        var formattedTime =  prependZero(d.getHours()) + ':' +
            prependZero(d.getMinutes()) + ':' +
            prependZero(d.getSeconds()) + ' ';

        $('#msgs').append('<li><span class="text-success">' + formattedTime + person.name + '</span>: ' + msg + '</li>');

        //clear typing field
        $('#' + person.name + '_t').remove();
        clearTimeout(timeoutId);
        timeoutId = setTimeout(timeUp, 0);
    });

    socket.on('disconnect', () => {
        $('#msgs').append('<li><span class="text-danger">You are disconnected.</span></li>');
        $('#msg').attr('disabled', 'disabled');
        $('#send').attr('disabled', 'disabled');
    });

    // handle history display
    socket.on('history', (data) => {
        if (data.length) {
            $('#msgs').append('<li><span class="text-info">Last 50 messages:</li>');
            $.each(data, (data, msg) => {
                $('#msgs').append('<li><span class="text-warning">' + msg + '</span></li>');
            });
        } else {
            $('#msgs').append('<li><span class="text-info">No past messages in this room.</li>');
        }
    });

    socket.on('sendRoomID', (data) => {
        currRoom = data.id;
    });

});
