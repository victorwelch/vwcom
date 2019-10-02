using Microsoft.AspNetCore.Mvc;
using vwcom.Models;
using System;
using System.Diagnostics;
using System.Net;
using System.Net.Mail;
using Wangkanai.Detection;

namespace vwcom.Controllers
{
    public class HomeController : Controller
    {
        private IDetection _detection;
        public HomeController(IDetection detection)
        {
            _detection = detection;
        }
        public IActionResult Index()
        {
            ViewData["Title"] = "VictorWelch.com: Home";
            return View();
        }

        public IActionResult About()
        {
            ViewData["Title"] = "VictorWelch.com: About";
            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Title"] = "VictorWelch.com: Contact";
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
