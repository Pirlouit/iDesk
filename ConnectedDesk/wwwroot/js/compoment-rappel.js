function Rappel(){
    this.list = [];
    this.notification = 0;
    let self = this;

    this.show = function(){
        if(this.list.length > 0){
            let data =  this.list.pop();
            document.querySelector('#rappel-date').innerHTML = data.date;
            document.querySelector('#rappel-body').innerHTML = data.body;
            document.querySelector('#rappel-content').style.display = "block";  
            this.notification--; 
            this.refreshNotification();
        }
    };

    this.add = function(date, body){
        this.list.reverse();
        this.list.push(new RappelContent(date, body));
        this.list.reverse();

        this.notification++;
        this.refreshNotification();
    };

    this.hide = function(){
        document.querySelector('#rappel-content').style.display = "none";  
    };

    this.refreshNotification = function(){
        if(this.notification > 0){
            document.querySelector('#rappel-indication').setAttribute('data-badge', this.notification);
        }else{
            document.querySelector('#rappel-indication').removeAttribute('data-badge');
        }
    };
}

function RappelContent(date, body){
    this.date = date;
    this.body = body;
}