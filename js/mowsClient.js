(function () {
    'use strict';

    // button for connection
    var $btnConnect      = document.querySelector('.btn-connect');
    var $btnDisconnect   = document.querySelector('.btn-disconnect');
    var $inputBrokerHost = document.querySelector('.broker-host');
    var $inputBrokerPort = document.querySelector('.broker-port');

    // button, input for publisher
    var $btnPublish      = document.querySelector('.btn-publish');
    var $inputPubTopic   = document.querySelector('.pub-topic');
    var $inputPubMessage = document.querySelector('.pub-message');

    // button, input for subscriber
    var $btnSubscribe    = document.querySelector('.btn-subscribe');
    var $btnUnSubscribe  = document.querySelector('.btn-unsubscribe');
    var $inputSubTopic   = document.querySelector('.sub-topic');

    // show log
    var $domLog = document.querySelector('.log');
    var client;
    var clientId;

    $btnConnect.addEventListener('click', function(e) {
        if (client && client.connected) return;
        var host = $inputBrokerHost.value;
        var port = $inputBrokerPort.value;
        var uri  = 'ws://' + host + ':' + port;
        // I guess mows.js has bugs about args of createClient method...
        client = mows.createClient(uri);

        appendLog("[connected] port:" + port + " host:" + host);

        client.on('message', function (topic, message, packet) {
            //console.log(packet);
            appendLog("[on message] topic:" + topic + " message:" + message + "retain:" + packet.retain);
        });
        client.on('error', function (e) {
            appendLog("[on error]" + e);
        });
    }, false);

    $btnDisconnect.addEventListener('click', function(e) {
        if (!client || !client.connected) return;
        client.end();
        appendLog("[disconnect]");
    });

    $btnPublish.addEventListener('click', function(e) {
        if (!client || !client.connected) return;
        var topic   = $inputPubTopic.value;
        var message = $inputPubMessage.value;
        client.publish(
            topic,
            message,
            {qos: 1, retain: true},
            appendLog("[published] topic:" + topic + " message:" + message)
        );

    }, false);

    $btnSubscribe.addEventListener('click', function(e) {
        if (!client || !client.connected) return;
        var topic = $inputSubTopic.value;
        client.subscribe(
            topic,
            {qos: 1},
            appendLog("[subscribed] topic:" + topic)
        );
    }, false);

    $btnUnSubscribe.addEventListener('click', function(e) {
        if (!client || !client.connected) return;
        var topic = $inputSubTopic.value;
        client.unsubscribe(
            topic,
            appendLog("[unsubscribed] topic:" + topic)
        );
    }, false);

    function appendLog(message) {
        //console.log(message);

        var parentElement = document.createElement("tr");
        var childElement  = document.createElement("tb");
        childElement.appendChild( document.createTextNode(message) );
        parentElement.appendChild( childElement );

        $domLog.appendChild( parentElement );
    }
})();
