using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectedDesk.Models
{
    public class Notification
    {
        public string Sender { get; set; }
        public int Priority { get; set; }
        public string Message { get; set; }
    }
}
