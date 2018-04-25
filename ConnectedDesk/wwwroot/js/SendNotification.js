var webSocket, input, button;

window.onload = function() {
    initWebSockets();
    var buttonSend = document.getElementById("buttonSend");
    buttonSend.onclick = function () { validateInputsAndSend(); }

    document.querySelector('#button-lock').onclick = function () {
        let button = document.querySelector('#button-lock');
        let res = {
            Key:"locked",
            type: "lock",
            value: button.value
        }
        socketSend(JSON.stringify(res));

        if (button.value === "lock") {
            button.value = "unlock";
            button.innerHTML = "unlock";
        } else {
            button.value = "lock";
            button.innerHTML = "lock";
        }
        
    }
};

//Init
function initWebSockets() {
    webSocket = new WebSocket("ws://" + location.host + "/ws/NotificationServer/");
    webSocket.onopen = (evt) => { this.socketOpen(evt); };
    webSocket.onmessage = (evt) => { this.socketMessage(evt); };
    webSocket.onerror = (evt) => { this.socketError(evt); };
    webSocket.onclose = (evt) => { this.socketClose(evt); };
}

//Handle Socket Events
function socketOpen(event) {
}
function socketMessage(event) {
    console.log(event.data);
}
function socketError(event) {
    console.log(event);
}
function socketClose(event) {
}
function socketSend(message) {
    webSocket.send(message);
}


function validateInputsAndSend() {
    var input = document.getElementById("inputNotif");
    var inputFinal = input.value;
    if (inputFinal === null || inputFinal.match(/^ *$/) !== null) {
        return;
    }

    var name = document.getElementById("inputName");
    var nameFinal = name.value;
    if (nameFinal === null || nameFinal.match(/^ *$/) !== null) {
        return;
    }

    var prio = document.getElementById("inputPriority");

    var res = {
        Key : "notification",
        Sender : nameFinal,
        Priority : prio.selectedIndex,
        Message : inputFinal
    }

    socketSend(JSON.stringify(res));
}