let site;

window.onload = function() {
    initWebSockets();
    site = new SmartDesk();
}

function SmartDesk(){
    let self = this;
    this.weather = null;
    this.techoffice = null;

    this.init = function () {
        if (this.weather != null && this.techoffice != null) {
            this.defineMoment();
            this.weather.init();
            this.techoffice.getDataByDeviceId(this.callbackTechOffice, 13, 4);

            /* $.getJSON("https://query.yahooapis.com/v1/public/yql", {
                      q:      "select * from json where url='https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=be-FR'",
                      format: "json"
                  },
                  function (data) {
                      if (data.query.results) {
                          document.body.style.backgroundImage = "url('https://bing.be/"+data.query.results.json.images.url+"')";
                      }
                  }
              );*/
        } 
    };

    this.callbackTechOffice = function(response) {
        response.forEach(function(elem) {
            if (elem.sensor.sensorId == 53) { //luminosity
                document.querySelector('#building-luminosity-value').innerHTML = elem.value;
                console.log(elem);
            } else if (elem.sensor.sensorId === 54) { //humidity
                document.querySelector('#building-humidity-value').innerHTML = elem.value;
                console.log(elem);
            } else if (elem.sensor.sensorId === 55) { //temperature
                document.querySelector('#building-temperature-value').innerHTML = elem.value;
                console.log(elem);
            }
        });
    };

    this.defineMoment = function(){
        moment.locale("fr"); 
        document.querySelector('#moment-date').innerHTML = moment().format('LL');
        document.querySelector('#moment-hour').innerHTML = moment().format('LTS'); 
        setInterval(function(){
            document.querySelector('#moment-hour').innerHTML = moment().format('LTS'); 
        }, 1000);
    };

    this.callbackBingImage = function(response){
        document.body.style.backgroundImage = "url(//bing.be/"+response.url+")";
    };
}

function SendRequestAsync(callback, url, type = "GET", json = null) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.open(type, url, true); // true for asynchronous 
    xhr.send(json);
}
