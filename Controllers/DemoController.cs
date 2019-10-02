using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace vwcom.Controllers
{
    public class DemoController : Controller
    {
        public IActionResult StatesOne()
        {
            ViewData["Title"] = "VictorWelch.com: States";
            return View();
        }
    }
}