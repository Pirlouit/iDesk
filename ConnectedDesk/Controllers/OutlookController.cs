using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConnectedDesk.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ConnectedDesk.Controllers
{
    [Produces("application/json")]
    [Route("api/Outlook")]
    public class OutlookController : Controller
    {
        private readonly MsGraph.MsGraphClient msGraphClient;

        private static List<Reminder> reminderList = new List<Reminder>();

        public OutlookController(MsGraph.MsGraphClient msGraphClient)
        {
            this.msGraphClient = msGraphClient;
        }

        [HttpGet]
        [Route("DayEvents")]
        public async Task<List<OutlookEvent>> GetDayEvents()
        {
            var eventList = await msGraphClient.FindEventAsync(DateTime.Now.ToUniversalTime(), DateTime.Now.Date.Add(new TimeSpan(23, 59, 59)));
            
            return eventList.Select(e => e.ToLocale()).ToList();
        }

        [HttpGet]
        [Route("NextEvent")]
        public async Task<OutlookEvent> NextEvent()
        {
            var eventList = await msGraphClient.FindEventAsync(DateTime.Now.ToUniversalTime(), DateTime.Now.Date.Add(new TimeSpan(23, 59, 59)));

            return eventList.Select(e => e.ToLocale()).FirstOrDefault();
        }

        [HttpGet]
        [Route("LastMessage")]
        public async Task<OutlookMail> LastMessage()
        {
            return await msGraphClient.GetLastEmailAsync();
        }

        [HttpGet]
        [Route("AllMessages")]
        public async Task<List<OutlookMail>> AllMessages()
        {
            return await msGraphClient.GetAllEmailsAsync();
        }

        [HttpGet]
        [Route("TodayMessages")]
        public async Task<List<OutlookMail>> TodayMessages()
        {
            var emailList = await msGraphClient.GetAllEmailsAsync();

            return emailList.FindAll(e => DateTime.Parse(e.CreatedDateTime).Date == DateTime.Today.Date);
        }

        [HttpPost]
        [Route("AddReminder")]
        public async Task<IActionResult> AddReminder(Reminder reminder)
        {
            reminder.Key = "reminder";
            reminderList.Add(reminder);
            return Ok("Reminder set.");
        }

        [HttpGet]
        [Route("CheckReminder")]
        public async Task<IActionResult> CheckReminder()
        {
            var newList = new List<Reminder>();

            foreach(var r in reminderList)
            {
                if (r.Time >= DateTime.Now.AddMinutes(-59))
                    newList.Add(r);
            }

            reminderList = newList;

            foreach(var r in reminderList)
            {
                if(r.Time.Hour == DateTime.Now.Hour && r.Time.Minute == DateTime.Now.Minute)
                {
                    // SEND NOTIFICATION TO DESKTOP
                    var notif = r;
                    var json = JsonConvert.SerializeObject(r);
                    await WebSockets.NotificationWebSocket.instance.SocketBroadcast(json);

                    // TRUN LED ON
                }
            }

            return Ok(newList);
        }
    }
}