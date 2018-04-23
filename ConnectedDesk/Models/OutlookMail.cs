using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectedDesk.Models
{
    public class OutlookMail
    {
        [JsonProperty("createdDateTime")]
        public string CreatedDateTime { get; set; }
        [JsonProperty("subject")]
        public string Subject { get; set; }
        [JsonProperty("bodyPreview")]
        public string BodyPreview { get; set; }
        [JsonProperty("body")]
        public Body Body { get; set; }
        [JsonProperty("sender")]
        public Sender Sender { get; set; }
        [JsonProperty("isRead")]
        public bool IsRead { get; set; }
    }

    public class Body
    {
        [JsonProperty("content")]
        public string Content { get; set; }
    }

    public class Sender
    {
        [JsonProperty("emailAddress")]
        public EmailAddress EmailAddress { get; set; }
    }

    public class EmailAddress
    {
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("address")]
        public string Address { get; set; }
    }
}
