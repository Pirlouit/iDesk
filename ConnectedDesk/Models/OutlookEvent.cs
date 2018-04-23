using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectedDesk.Models
{
    public class OutlookEvent
    {
        [JsonProperty("subject")]
        public string Subject { get; set; }
        [JsonProperty("bodyPreview")]
        public string BodyPreview { get; set; }
        [JsonProperty("start")]
        public EventTime Start { get; set; }
        [JsonProperty("end")]
        public EventTime End { get; set; }
    }

    public class EventTime
    {
        [JsonProperty("dateTime")]
        public string DateTime { get; set; }
        [JsonProperty("timeZone")]
        public string TimeZone { get; set; }
    }


    public static class Extension
    {
        public static OutlookEvent ToLocale(this OutlookEvent oEvent)
        {
            oEvent.Start.DateTime = DateTime.Parse(oEvent.Start.DateTime).ToLocalTime().ToString();
            oEvent.End.DateTime = DateTime.Parse(oEvent.End.DateTime).ToLocalTime().ToString();

            return oEvent;
        }

        public static OutlookEvent ToUTC(this OutlookEvent oEvent)
        {
            oEvent.Start.DateTime = DateTime.Parse(oEvent.Start.DateTime).ToUniversalTime().ToString();
            oEvent.End.DateTime = DateTime.Parse(oEvent.End.DateTime).ToUniversalTime().ToString();

            return oEvent;
        }
    }

}
