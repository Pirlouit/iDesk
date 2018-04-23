function Email() {
    this.list = [];
    this.notification = 0;
    let self = this;

    this.show = function () {
        if (this.list.length > 0) {
            let data = this.list.pop();
            document.querySelector('#email-username').innerHTML = data.username;
            document.querySelector('#email-adress').innerHTML = data.email;
            document.querySelector('#email-title').innerHTML = data.title;
            document.querySelector('#email-body').innerHTML = data.body;

            document.querySelector('#email-content').style.display = "block";  
            this.notification--;
            this.refreshNotification();
        }
    };

    this.add = function (username, email, title, body) {
        this.list.reverse();
        this.list.push(new MailContent(username, email, title, body));
        this.list.reverse();

        this.notification++;
        this.refreshNotification();
    };

    this.hide = function () {
        document.querySelector('#email-content').style.display = "none";
    };

    this.refreshNotification = function () {
        if (this.notification > 0) {
            document.querySelector('#email-indication').setAttribute('data-badge', this.notification);
        } else {
            document.querySelector('#email-indication').removeAttribute('data-badge');
        }
    };
}

function MailContent(username, email, title, body) {
    this.username = username;
    this.email = email;
    this.title = title;
    this.body = body;
}