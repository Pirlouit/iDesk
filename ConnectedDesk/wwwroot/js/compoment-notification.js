function Notification(){
    this.list = [];
    this.notification = 0;
    let self = this;

    this.init = function(){
        document.querySelector('#notification-indication').setAttribute('data-badge',"1");
    };

    this.add = function(from, body){
        this.list.reverse();
        this.list.push(new NotificationContent(from, body));
        this.list.reverse();

        this.notification++;
        this.refreshNotification();
    };

    this.show = function(){ 
        if(this.list.length > 0){
            let data = this.list.pop();
            document.querySelector('#notification-from').innerHTML = data.from;
            document.querySelector('#notification-body').innerHTML = data.body;
            document.querySelector('#notification-content').style.display = "block";  
            
            this.notification--; 
            this.refreshNotification();
        }
    };

    this.hide = function(){
        document.querySelector('#notification-content').style.display = "none";  
    };

    this.refreshNotification = function(){
        if(this.notification > 0){
            document.querySelector('#notification-indication').setAttribute('data-badge', this.notification);
        }else{
            document.querySelector('#notification-indication').removeAttribute('data-badge');
        }
    };
}

function NotificationContent(from, body){
    this.from = from;
    this.body = body;
}
