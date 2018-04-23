function Calendar(){
    this.list = [];
    this.notification = 0;
    let self = this;

    this.show = function(){
        if(this.list.length > 0){
            let data =  this.list.pop();
            document.querySelector('#calendar-start').innerHTML = data.start;
            document.querySelector('#calendar-end').innerHTML = data.end;
            document.querySelector('#calendar-title').innerHTML = data.title;
            document.querySelector('#calendar-description').innerHTML = data.description;

            document.querySelector('#calendar-content').style.display = "block";  
            this.notification--; 
            this.refreshNotification();
        }
    };

    this.add = function(start, end, title, description){
        this.list.reverse();
        this.list.push(new CalendarContent(start, end, title, description));
        this.list.reverse();

        this.notification++;
        this.refreshNotification();
    };

    this.hide = function(){
        document.querySelector('#calendar-content').style.display = "none";  
    };

    this.refreshNotification = function(){
        if(this.notification > 0){
            document.querySelector('#calendar-indication').setAttribute('data-badge', this.notification);
        }else{
            document.querySelector('#calendar-indication').removeAttribute('data-badge');
        }
    };
}

function CalendarContent(start, end, title, description){
    this.start = start;
    this.end = end;
    this.title = title;
    this.description = description;
}