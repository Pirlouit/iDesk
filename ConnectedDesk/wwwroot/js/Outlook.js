let Outlook = new function(){
	function SendRequest(url, callback){
		$.ajax({
            type: "GET",
            url: window.location.href.split(window.location.pathname)[0] + "/api/Outlook/" + url,
            success: callback,
            error: function (err) {
                console.log(err);
                alert("An error occured !");
            }
        });
	}
	this.NextEvent = function(callback){
		return SendRequest("NextEvent", callback);
	}
	this.DayEvents = function(callback){
		return SendRequest("DayEvents", callback);
	}
	this.LastMessage = function(callback){
		return SendRequest("LastMessage", callback);
	}
	this.AllMessages = function(callback){
		return SendRequest("AllMessages", callback);
	}
	this.TodayMessages = function(callback){
		return SendRequest("TodayMessages", callback);
	}
}

function eventToSpeech(event) {

    var start = moment(event.start.dateTime);
    var end = moment(event.end.dateTime);

    var startHour = start.format("H");
    var startMinute = start.format("m");
    var endHour = end.format("H");
    var endMinute = end.format("m");

    var phrase = "De " + (startHour == 12 ? "midi" : startHour + " heures ")
        + (startMinute == 0 ? "" : startMinute) + " à "
        + (endHour == 12 ? "midi" : endHour + " heures ")
        + (endMinute == 0 ? "" : endMinute) + ". ";


    console.log("Event to speech: " + phrase);

    var calendar = new Calendar();
    calendar.add(event.start.dateTime, event.end.dateTime, event.subject, event.bodyPreview);
    console.log(calendar);
    calendar.show();

    responsiveVoice.speak(phrase, "French Female", {
        onend: function () {
            phrase = event.subject + ". ";
            responsiveVoice.speak(phrase, "French Female", {
                onend: function () {
                    setTimeout(function () {
                        calendar.hide();
                    }, 6000);
                }
            });
        }
    });
}

function emailToSpeech(email) {
    var emailObj = new Email();
    emailObj.add(email.sender.emailAddress.name, email.sender.emailAddress.address, email.subject, email.bodyPreview);
    emailObj.show();
    console.log("email");
    console.log(email);
	var phrase = "Email de " + email.sender.emailAddress.name + " ayant comme objet " + email.subject + ".";
	responsiveVoice.speak(phrase, "French Female", { 
		onend: function(){
			setTimeout(function(){
				phrase = email.bodyPreview;
				console.log(email);
                responsiveVoice.speak(phrase, "French Female", {
                    onend: function () {
                        setTimeout(function () {
                            emailObj.hide();
                        },10000);
                    }
                });
			}, 350);
		}
	});
}