using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectedDesk.Models
{
    public class OutlookRoot<T>
    {
        [JsonProperty("value")]
        public List<T> Value { get; set; }
    }
}
