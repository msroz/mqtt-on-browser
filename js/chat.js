(function(){
    'use strict';

    // constants
    var URL   = 'ws://test.mosquitto.org:8080';
    var TOPIC = 'chat';

    // dom
    var $btnPost   = document.querySelector('.btn-post');
    var $btnAA     = document.querySelector('.btn-aa');
    var $inputText = document.querySelector('.input-text');
    var $room      = document.querySelector('.room');

    var client;
    var clientId;

    function initialize(){
        console.log('initialize');

        client = mows.createClient(URL);
        clientId = client.options.clientId;
        //console.log(clientId);

        client.subscribe(TOPIC, function(){
            appendMessage('enter the room', 'center');
        });

        client.on('message', function(topic, message, packet){
            var array = message.split(':');
            // not show if publisher == publisher
            if (clientId === array[0]) {
                console.log('same clientId:' + clientId);
            } else {
                appendMessage(array[1]);
            }
        });

        client.on('error', function(e) {
            alert(e);
        });
    }

    function appendMessage(message, type) {
        var $div = document.createElement('div');
        if (type === 'mine') {
            $div.innerHTML = '<div class="message-mine">' + message + '</div>';
        }
        else if ( type == 'center') {
            $div.innerHTML = '<div>' + message + '</div>';
        }
        else {
            $div.innerHTML = '<div class="message-others">' + message + '</div>';
        }
        $room.appendChild($div);
    }

    $btnPost.addEventListener('click', function(e) {
        if (!client || !client.connected ) {
            alert('not connected');
            return;
        }
        var message = $inputText.value;
        client.publish(
            TOPIC,
            client.options.clientId + ':' + message,
            { qos: 1 },
            function (){
                appendMessage(message, 'mine');
            }
        );
    }, false);

    $btnAA.addEventListener('click', function(e) {
        if (!client || !client.connected ) {
            alert('not connected');
            return;
        }
        var message = $btnAA.value;
        client.publish(
            TOPIC,
            client.options.clientId + ':' + message,
            { qos: 1 },
            function (){
                appendMessage(message, 'mine');
            }
        );
    }, false);

    initialize();
})();
