using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectedDesk.Models
{
    public class Reminder
    {
        public string Key { get; set; }
        public DateTime Time { get; set; }
        public string Message { get; set; }
    }
}
