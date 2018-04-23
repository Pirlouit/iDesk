using Microsoft.AspNetCore.Mvc;

namespace ConnectedDesk.Controllers
{
    public class ConnectDeskController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}