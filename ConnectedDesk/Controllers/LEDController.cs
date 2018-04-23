using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConnectedDesk.Helpers;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ConnectedDesk.Controllers
{
    public class LEDController : Controller
    {
        private readonly LEDHelper _ledHelper;

        public LEDController(LEDHelper LedHelper)
        {
            _ledHelper = LedHelper;
        }

        [Route("LED/SendNotification/{notification}")]
        public async Task SendNotification(string notification)
        {
            //important
            //notimportant
            //reminder
            await _ledHelper.SendNotification(notification);
        }

    }
}
