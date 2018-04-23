function Weather(key){
    let self = this;
    this.key = key;

    this.init = function(){
        /*if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position){
                self.sendRequest(position.coords.latitude, position.coords.longitude);
            });
        }*/
        this.sendRequest();
    };

    /*this.sendRequest = function(lat, lon){
        SendRequestAsync(this.callback, "http://api.openweathermap.org/data/2.5/forecast?at="+lat+"&lon="+lon+"&APPID=" + this.key);  
    };*/
    this.sendRequest = function(){
        SendRequestAsync(this.callback, "https://api.openweathermap.org/data/2.5/forecast?q=Mons,be&units=metric&lang=fr&APPID=" + this.key);
    }

    this.callback = function(response){
        let find = response.list[0];
        let i = 0;
        
        self.design(response.city.name,find.main.humidity, find.main.temp, 
            find.weather[0].description, find.weather[0].id);
    };

    this.design = function (city, humidity, temperature, description, code){
        document.querySelector('#weather-city').innerHTML = city;
        document.querySelector('#weahter-icon').firstChild.setAttribute("class", this.handleIcon(code));
        document.querySelector('#weather-description').innerHTML = description;
        document.querySelector('#weather-temperature-value').innerHTML= temperature;
        document.querySelector('#weather-humidity-value').innerHTML= humidity;
    }


    this.handleIcon = function(code) {
        let prefix = 'wi wi-';
        let icon = weatherIcons[code].icon;
      
        // If we are not in the ranges mentioned above, add a day/night prefix.
        if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
          icon = 'day-' + icon;
        }
        // Finally tack on the prefix.
        icon = prefix + icon;
        return icon;
      }
}