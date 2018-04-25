var webSocket;
let notif = new Notification();
let reminder = new Rappel();

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
    let data = JSON.parse(event.data);
    switch (data.Key) {
        case "techOffice":
            site.techoffice = new techOffice(data.techOffice);
            site.init();
            break;
        case "openWeatherMap":
            site.weather = new Weather(data.openWeatherMap);
            site.init();
            break;
        case "locked":
            lock(data);
            break;
        case "notification":
            notification(data);
            break;
        case "reminder":
            remind(data);
            break;
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


/********** Method *********/
function lock(data) {
    if (data.value === "lock") {
        document.querySelector('#smart-lock').style.display = "block";
    } else {
        document.querySelector('#smart-lock').style.display = "none";
    }
}

function notification(data) {
    notif.add(data.Sender, data.Message);
}

function remind(data) {
    reminder.add(data.Time, data.Message);
    responsiveVoice.speak(data.Message, "French Female", {
        onstart: function () {
            reminder.show();
        },
        onend: function () {
            setTimeout(function () {
                reminder.hide();
            }, 6000);
        }
    });
}