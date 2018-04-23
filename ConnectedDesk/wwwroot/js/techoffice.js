function techOffice (key){
    this.key = key;
    this.url = "https://techofficeopendata.azurewebsites.net/api";
    var selfTechOffice = this;

    /**
     * Get /Device
     * Return all devices with their sensors. 
     * @param {*} callback Callback method 
     */
    this.getDevices = function (callback){
        this.httpGetAsync(callback, "/Device");
    };
    
    /**
     * Get /Device/{id}
     * Return a device with its sensors.
     * @param {*} callback Callback method
     * @param {*} id deviceId
     */
    this.getDeviceById = function(callback, id){
        this.httpGetAsync(callback, "/Device/" + id);
    } 

    /**
     * Receipt the devices with a type of sensor
     * Get /Device/type/{type}
     * @param {*} callback Callback method
     * @param {*} type /humidty for example
     */
    this.getDeviceByType = function (callback, type){
        this.httpGetAsync(callback, "/Device/type/" + type);
    };

    /**
     * Get /Sensor
     * @param {*} callback Callback method
     */
    this.getSensors = function (callback){
        this.httpGetAsync(callback, "/Sensor");
    }; 

    /**
     * Get Sensor from sensorId
     * Get /sensor/{id}
     * @param {*} callback Callback method
     * @param {*} id sensorId
     */
    this.getSensorById = function(callback, id){
        this.httpGetAsync(callback, "/Sensor/" + id);
    };

    /**
     * Get /
     * @param {*} callback 
     * @param {*} type 
     */
    this.getSensorByType = function(callback, type){
        this.httpGetAsync(callback, "/Sensor/type/" + type);
    };

    /**
     * 
     * @param {*} callback 
     */
    this.getSensorDistinct = function(callback){
        this.httpGetAsync(callback, "/Sensor/distinct");
    };

    /**
     * 
     * @param {*} callback 
     * @param {*} maxRow default : 100, all : -1
     * @param {*} detail 
     * @param {*} starDate 
     * @param {*} endDate 
     */
    this.getData = function(callback, maxRow = 100, detail = false, starDate = null, endDate = null){
        let parameters = "/Data/";
        parameters += this.defaultValues(maxRow, starDate, endDate);

        parameters += "&Detail=" + encodeURIComponent(detail);
        this.httpGetAsync(callback, parameters);
    };

    /**
     * 
     * @param {*} callback 
     * @param {*} deviceId 
     * @param {*} maxRow 
     * @param {*} detail 
     * @param {*} starDate 
     * @param {*} endDate 
     */
    this.getDataByDeviceId = function(callback, deviceId, maxRow = 100, detail = false, starDate = null, endDate = null){
        let parameters = "/Data/";
        parameters += this.defaultValues(maxRow, starDate, endDate);

        parameters += "&Detail=" + encodeURIComponent(detail)
        + "&DeviceId=" + encodeURIComponent(deviceId);

        this.httpGetAsync(callback, parameters);
    };

    /**
     * 
     * @param {*} callback 
     * @param {*} sensorId 
     * @param {*} maxRow 
     * @param {*} detail 
     * @param {*} starDate 
     * @param {*} endDate 
     */
    this.getDataBySensorId = function(callback, sensorId, maxRow = 100, detail = false, starDate = null, endDate = null){
        let parameters = "/Data/";
        parameters += this.defaultValues(maxRow, starDate, endDate);

        parameters += "&Detail=" + encodeURIComponent(detail)
        + "&SensorId=" + encodeURIComponent(sensorId);

        this.httpGetAsync(callback, parameters);
    };

    /**
     * 
     * @param {*} callback 
     * @param {*} sensorType 
     * @param {*} maxRow 
     * @param {*} detail 
     * @param {*} starDate 
     * @param {*} endDate 
     */
    this.getDataBySensorType = function(callback, sensorType , maxRow = 100, detail = false, starDate = null, endDate = null){
        let parameters = "/Data/";
        parameters += this.defaultValues(maxRow, starDate, endDate);

        parameters += "&Detail=" + encodeURIComponent(detail)
        + "&SensorType=" + encodeURIComponent(sensorType);

        this.httpGetAsync(callback, parameters);
    };

    /**
     * 
     * @param {*} maxRow 
     * @param {*} starDate 
     * @param {*} endDate 
     */
    this.defaultValues = function (maxRow, starDate = null, endDate = null){
        let parameters = "";

        if(starDate == null){
            starDate = new Date();
            starDate.setHours(0);
            starDate.setMinutes(0);
            starDate.setSeconds(0);
        }
        if(endDate == null){
            endDate = new Date();
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
        }
        parameters += "?StartDate=" + starDate.toISOString()
        + "&EndDate=" + endDate.toISOString();
        
        if(maxRow > -1)
            parameters += "&MaxRow=" + encodeURIComponent(maxRow);

        return parameters;
    };

    /**
     * 
     * @param {*} callback 
     * @param {*} endpoint 
     */
    this.httpGetAsync = function (callback, endpoint)
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && xhr.status == 200){
                callback(JSON.parse(xhr.responseText));
            } else if(xhr.readyState == 4){
                selfTechOffice.dispachEvent(xhr.status, xhr.responseText);
            }
        }
        xhr.open("GET", this.url + endpoint, true); // true for asynchronous 
        xhr.setRequestHeader("Authorization", this.key);
        xhr.send(null);
    }; 

    /**
     * 
     * @param {*} status 
     * @param {*} text 
     */
    this.dispachEvent = function(status, text){
        var message = "";
        switch(status){
            case 401 :
                message = { 
                    type : 401,
                    value : "API Key is not valid"
                };
                break;
            case 404 :
                message = { 
                    type : 404,
                    value : "Data were not found"
                };
                break;
            case 409 :
                message = { 
                    type : 409,
                    value : text
                };
                break;
            default :
                message = { 
                    type : 0,
                    value : "Internet connection error"
                };
                break;
        }
        document.dispatchEvent(new CustomEvent('TechOfficeError', {
            detail : message,
            bubbles: true,
            cancelable: false
        }));
    };


    /**
     * 
     * @param {*} response 
     */
    this.dataHandling = function(response){
        var values = [];
        response.forEach(function(resp) {
            values.push(resp.value);
        });
        return values;
    };

    /**
     * 
     * @param {*} response 
     */
    this.countHandling = function(response){
        var values = 0;
        response.forEach(function(resp) {
            values += resp.value;
        });
        return values;
    };

    /**
     * 
     * @param {*} response 
     */
    this.countWithDateHandling = function(response){
        var data = [];
        response.forEach(function(elem){
            data.push([elem.value, elem.timestamp]);
        });
        return data;
    };

    /**
     * 
     * @param {*} date 
     */
    this.isInLast24h = function(date){
        var date1 = Math.round(new Date(date).getTime()/1000);
        var timeStamp = Math.round(new Date().getTime() / 1000);
        var timeStampYesterday = timeStamp - (24 * 3600);
       
        return (date1 >= new Date(timeStampYesterday).getTime());
    };

    this.isFromToDay = function(timestamp){
        let date = new Date(timestamp);
        date.setHours(date.getHours()+1);
        
        let date1 = Math.round(date.getTime()/1000);
        let toDay = new Date();
        toDay.setHours(1);
        toDay.setMinutes(0);
        toDay.setSeconds(0);
        let newTimestamp = Math.round(toDay.getTime()/100);

        return (date1 >= newTimestamp);
    }

    /**
     * 
     * @param {*} data data is an array of value and timestamp 
     */
    this.processDayData = function(data){
        var filter = [];
        var now  = new Date();
        var day;
        var j = 0;
        
        for(var i = 0; i< data.length; i++){
            if(this.isInLast24h(data[i][1])){
                var time = new Date(data[i][1]);
                time = time.getHours()+":"+time.getMinutes();
                
                filter[j] = {
                    data: data[i][0], 
                    time: time
                };
                j++;

            }
        }
        return filter;
    };

    /**
     * 
     * @param {*} data data is an array of value and timestamp 
     */
    this.processToDayData = function(data){
        var filter = [];
        var now  = new Date();
        var day;
        var j = 0;
        
        for(var i = 0; i< data.length; i++){
            if(this.isFromToDay(data[i][1])){
                var time = new Date(data[i][1]);
                time = time.getHours()+":"+time.getMinutes();
                
                filter[j] = {
                    data: data[i][0], 
                    time: time
                };
                j++;

            }
        }
        return filter;
    };
}