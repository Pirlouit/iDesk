var webSocket;
let notif = new Notification();
let reminder = new Rappel();

//Init
function initWebSockets() {
    webSocket = new WebSocket("wss://" + location.host + "/ws/NotificationServer/");
    webSocket.onopen = (evt) => { this.socketOpen(evt); };
    webSocket.onmessage = (evt) => { this.socketMessage(evt); };
    webSocket.onerror = (evt) => { this.socketError(evt); };
    webSocket.onclose = (evt) => { this.socketClose(evt); };
}

//Handle Socket Events
function socketOpen(event) {
}
function socketMessage(event) {
    let data = JSON.parse(event.data);
    if (data.type !== null) {
        if (data.value === "lock") {
            document.querySelector('#smart-lock').style.display = "block";
        } else {
            document.querySelector('#smart-lock').style.display = "none";
        }
    }
    else if (data.Priority !== null) {
        notif.add(data.Sender, data.Message);
    }
    else if (data.Time !== null) {
        reminder.add(data.Time, data.Message);
        responsiveVoice.speak(data.Message, "French Female", {
            onstart: function() {
                reminder.show();
            },
            onend: function () {
                setTimeout(function () {
                    reminder.hide();
                }, 6000);
            }
        });
    }
}
function socketError(event) {
    console.log(event);
}
function socketClose(event) {
    console.log(event);
}
function socketSend(message) {
    webSocket.send(message);
}