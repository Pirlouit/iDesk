/*
    Note pour les emails:
    Si on veut récupérer l'html directement il suffit de récupérer body.content
    Ensuite supprimer des caractères:
    - \r\n
    - \t
    Et remplacer \" par "
    Pour plus d'infos, contacter Pirlouit Provis
*/

const artyom = new Artyom();
let currentShowingDiv;

$(function() {
    responsiveVoice.setDefaultVoice("French Female");
    startContinuousArtyom();
});

function startContinuousArtyom(){
    artyom.fatality();

    setTimeout(function(){
         artyom.initialize({
            lang: "fr-FR",
            continuous:true,
            listen:true,
            debug:true,
            speed:1
        }).then(function(){
            console.log("Artyom is ready to work !");
        });
    },250);
}

artyom.when("TEXT_RECOGNIZED",function(val){

    //Do something...
});
artyom.when("NOT_COMMAND_MATCHED",function(val){

    artyom.restart();
    //Do something...
});

/********* AGENDA *********/
artyom.addCommands({
    indexes:[
            "montre-moi mes prochains rendez-vous", 
            "montre-moi mes prochains rendez-vous de la journée", 
            "montre-moi mes prochains rendez-vous aujourd'hui",
            "montre-moi mes rendez-vous", 
            "montre-moi mes rendez-vous de la journée", 
            "montre-moi mes rendez-vous aujourd'hui"],
    action:function(i){           
        Outlook.NextEvent(function (event) {
            if (event != null) {
                var calendar = new Calendar();
                calendar.add(event.start.dateTime, event.end.dateTime, event.subject, event.bodyPreview);
                calendar.show();
            }
        });
    }
});
artyom.addCommands({
    indexes:[
            "dis-moi mes rendez-vous", 
            "dis-moi mes rendez-vous de la journée", 
            "dis-moi mes rendez-vous aujourd'hui",
            "dis-moi mes prochains rendez-vous", 
            "dis-moi mes prochains rendez-vous de la journée", 
            "dis-moi mes prochains rendez-vous aujourd'hui",
            "cite-moi mes prochains rendez-vous",
            "cite-moi mes rendez-vous", 
            "cite-moi mes rendez-vous de la journée", 
            "cite-moi mes rendez-vous aujourd'hui", 
            "cite-moi mes prochains rendez-vous de la journée", 
            "cite-moi mes prochains rendez-vous aujourd'hui",
            "quels sont mes prochains rendez-vous",
            "quels sont mes rendez-vous", 
            "quels sont mes rendez-vous de la journée", 
            "quels sont mes rendez-vous aujourd'hui", 
            "quels sont mes prochains rendez-vous de la journée", 
            "quels sont mes prochains rendez-vous aujourd'hui",
            "quels sont les prochains rendez-vous",
            "quels sont les rendez-vous", 
            "quels sont les rendez-vous de la journée", 
            "quels sont les rendez-vous aujourd'hui", 
            "quels sont les prochains rendez-vous de la journée", 
            "quels sont les prochains rendez-vous aujourd'hui",
            ],
    action:function(i){           
        Outlook.DayEvents(function(eventArray){
            if(eventArray.length == 0)
                responsiveVoice.speak("Vous n'avez pas de rendez-vous prévu aujourdhui.");
            else{
                responsiveVoice.speak("Aujourd'hui, vous avez " + eventArray.length + "rendez-vous. ");
                for (var i = 0; i < eventArray.length; i++){
                    eventToSpeech(eventArray[i]);
                }
            }
        });
    }
});
artyom.addCommands({
    indexes:[
            "montre-moi mon prochain rendez-vous", 
            "montre-moi mon prochain rendez-vous de la journée", 
            "montre-moi mon prochain rendez-vous aujourd'hui",
            "montre-moi mon rendez-vous", 
            "montre-moi mon rendez-vous de la journée", 
            "montre-moi mon rendez-vous aujourd'hui"],
    action: function (i) {
        Outlook.NextEvent(function (event) {
            if (event != null) {
                var calendar = new Calendar();
                calendar.add(event.start.dateTime, event.end.dateTime, event.subject, event.bodyPreview);
                calendar.show();
            }            
        });        
    }
});
artyom.addCommands({
    indexes:[
            "dis-moi mon rendez-vous", 
            "dis-moi mon rendez-vous de la journée", 
            "dis-moi mon rendez-vous aujourd'hui",
            "dis-moi mon prochain rendez-vous", 
            "dis-moi mon prochain rendez-vous de la journée", 
            "dis-moi mon prochain rendez-vous aujourd'hui",
            "cite-moi mon prochain rendez-vous",
            "cite-moi mon rendez-vous", 
            "cite-moi mon rendez-vous de la journée", 
            "cite-moi mon rendez-vous aujourd'hui", 
            "cite-moi mon prochain rendez-vous de la journée", 
            "cite-moi mon prochain rendez-vous aujourd'hui",
            "quel est mon prochain rendez-vous",
            "quel est mon rendez-vous", 
            "quel est mon rendez-vous de la journée", 
            "quel est mon rendez-vous aujourd'hui", 
            "quel est mon prochain rendez-vous de la journée", 
            "quel est mon prochain rendez-vous aujourd'hui",
            "quel est mon prochain rendez-vous",
            "quel est mon rendez-vous", 
            "quel est mon rendez-vous de la journée", 
            "quel est mon rendez-vous aujourd'hui", 
            "quel est mon prochain rendez-vous de la journée", 
            "quel est mon prochain rendez-vous aujourd'hui",
            "donne-moi mon rendez-vous", 
            "donne-moi mon rendez-vous de la journée", 
            "donne-moi mon rendez-vous aujourd'hui", 
            "donne-moi mon prochain rendez-vous de la journée", 
            "donne-moi mon prochain rendez-vous aujourd'hui",
            ],
    action:function(i){           
        Outlook.NextEvent(function(event){
            if(event == null)
                responsiveVoice.speak("Vous n'avez pas de rendez-vous prévu aujourdhui.");
            else
                eventToSpeech(event);
        });
    }
});

/********* REMINDER *********/
artyom.addCommands({
    smart: true,
    indexes:[
            "rappelle-moi *",
            "tu veux bien me rappeler *",
            "veux-tu bien me rappeler *",
            ],
            //2013-02-08 09:30 
    action:function(i, wildcard){
        var wildcardSplit = wildcard.split("à");

        var remindTime;

        for(var i = 1; i < wildcardSplit.length; i++){
            var reminderTimeTmp = moment().set({
               'hour' : 0,
               'minute'  : 0, 
               'second' : 0
            });
            if(wildcardSplit[i].indexOf("midi") != -1){
                reminderTimeTmp.hour(12);
                console.log(wildcard);
                var stringToRemove = "à midi";
                console.log(stringToRemove);
                wildcard = wildcard.replace(stringToRemove, "");
                remindTime = reminderTimeTmp;
                break;
            }
            else if(wildcardSplit[i].indexOf("minuit") != -1){
                reminderTimeTmp.hour(0);
                console.log(wildcard);
                var stringToRemove = "à minuit";
                console.log(stringToRemove);
                wildcard = wildcard.replace(stringToRemove, "");
                remindTime = reminderTimeTmp;
                break;
            }
            var time = wildcardSplit[i].replace(" ", "").split("h");
            var hour = parseInt(time[0]);
            if(isFinite(hour)){
                reminderTimeTmp.hour(hour); 
                if(time[1] != ""){
                    var timeSplit = time[1].split(" ");
                    console.log(timeSplit);
                    if(timeSplit[0] != ""){
                        var minute = parseInt(timeSplit[0]);
                        console.log(minute);
                        if(isFinite(minute))
                            reminderTimeTmp.minute(minute);
                    }

                    console.log(wildcard);
                    var stringToRemove = "à " + hour + "h" + (minute == null ? "" : minute);
                    console.log(stringToRemove);
                    wildcard = wildcard.replace(stringToRemove, "");
                    
                }
                remindTime = reminderTimeTmp;
                break;
            }
        }
        if(remindTime == null){
            responsiveVoice.speak("Désolé mais vous n'avez pas spécifié d'heure.");
        }
        else{
            var remindMessage = "Noubliez pas " + wildcard;
            var remindTimeShort = remindTime.format("H:mm");
            /*
            var hour = parseInt(remindTime.format("H")) - parseInt(moment().format("H"));
            console.log("Hour = " + hour);
            if (parseInt(remindTime.format("mm")) > parseInt(moment().format("mm")){
                hour += 1;
            }*/
            
            $.ajax({
                type: "POST",
                url: window.location.href.split(window.location.pathname)[0] + "/api/Outlook/AddReminder",
                data: {
                    time: remindTime.toISOString(),
                    message: "N'oubliez pas " + wildcard
                },
                success: function (data) {

                },
                error: function (err) {
                    console.log(err);
                    alert("An error occured !");
                }
            });            

            console.log("Rappler enregistrer à " + remindTimeShort);
            responsiveVoice.speak("Je vous rapellerai à " + remindTimeShort + " de ne pas oublier" + wildcard);            
        }

    }
});

/********* EMAIL *********/
artyom.addCommands({
    indexes: [
        "lis-moi mon dernier mail",
        "lis-moi mon dernier e-mail",
        "lis-moi le dernier mail",
        "lis-moi le dernier e-mail",
        "quel est mon dernier mail",
        "quel est mon dernier e-mail",
        "quel est le dernier mail",
        "quel est le dernier e-mail",
        "lis-moi mon dernier mail que j'ai reçu",
        "lis-moi mon dernier e-mail que j'ai reçu",
        "lis-moi le dernier mail que j'ai reçu",
        "lis-moi le dernier e-mail que j'ai reçu",
        "quel est mon dernier mail que j'ai reçu",
        "quel est mon dernier e-mail que j'ai reçu",
        "quel est le dernier mail que j'ai reçu",
        "affiche mes emails",
        "montre-moi mon dernier mail",
        "montre-moi mon dernier e-mail",
        "montre-moi le dernier mail",
        "montre-moi le dernier e-mail",
        "montre-moi mon dernier mail que j'ai reçu",
        "montre-moi mon dernier e-mail que j'ai reçu",
        "montre-moi le dernier mail que j'ai reçu",
        "montre-moi le dernier e-mail que j'ai reçu",
        "quel est le dernier e-mail que j'ai reçu"
    ],
    action: function (i) {
        Outlook.LastMessage(function (email) {
            emailToSpeech(email);
        });
    }
});

artyom.addCommands({
    indexes: [
        "merci",
    ],
    action: function (i) {
        if (currentShowingDiv)
            currentShowingDiv.hide();
    }
});

/******** NOTIFICATION ***********/
artyom.addCommands({
    indexes: [
        "dis-moi ma notification",
        "dis-moi ma notification que j'ai reçu",
        "dis-moi ma dernière notification",
        "dis-moi ma dernière notification que j'ai reçu",
        "dis-moi la notification",
        "dis-moi la notification que j'ai reçu",
        "dis-moi la dernière notification",
        "dis-moi la dernière notification que j'ai reçu",
        "lis-moi ma notification",
        "lis-moi ma notification que j'ai reçu",
        "lis-moi ma dernière notification",
        "lis-moi ma dernière notification que j'ai reçu",
        "lis-moi la notification",
        "lis-moi la notification que j'ai reçu",
        "lis-moi la dernière notification",
        "lis-moi la dernière notification que j'ai reçu",
        "quel est ma notification",
        "quel est ma notification que j'ai reçu",
        "quel est ma dernière notification",
        "quel est ma dernière notification que j'ai reçu",
        "quel est la notification",
        "quel est la notification que j'ai reçu",
        "quel est la dernière notification",
        "quel est la dernière notification que j'ai reçu",
    ],
    action: function (i) {
        if (notif.list.length > 0) {
            var from = notif.list[0].from;
            var body = notif.list[0].body;
            notif.show();
            responsiveVoice.speak("Notification de " + from + "." + body, "French Female", {
                onend: function () {
                    setTimeout(function () {
                        notif.hide();
                    }, 6000);
                }
            });
           
        }        
    }
});

/******** Présentation ***********/
artyom.addCommands({
    indexes: [
        "qui es-tu",
        "présente-toi"
    ],
    action: function (i) {
        let message = "Je suis ail desk. Votre assistante bureautique personnelle. Mon objectif est de simplifier vos tâches quotidiennes dans votre travail.";
        responsiveVoice.speak(message);
    }
});

/******** Présentation ***********/
artyom.addCommands({
    indexes: [
        "verrouille-toi",
        "verrouille toi"
    ],
    action: function (i) {
        document.querySelector('#smart-lock').style.display = "block";
    }
});


/******** Présentation ***********/
artyom.addCommands({
    indexes: [
        "Quel est le sens de la vie"
    ],
    action: function (i) {
        responsiveVoice.speak("42");
    }
});