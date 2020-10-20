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
      Models.UtilVariables.Context = HttpContext;
      ViewData["BaseUrl"] = Models.UtilVariables.BaseUrl();
      ViewData["Title"] = "VictorWelch.com: States One";
      return View();
    }
    public IActionResult StatesTwo()
    {
      Models.UtilVariables.Context = HttpContext;
      ViewData["BaseUrl"] = Models.UtilVariables.BaseUrl();
      ViewData["Title"] = "VictorWelch.com: States Two";
      return View();
    }
    public IActionResult RadioKnobs()
    {
      Models.UtilVariables.Context = HttpContext;
      ViewData["BaseUrl"] = Models.UtilVariables.BaseUrl();
      ViewData["Title"] = "VictorWelch.com: Radio Knobs";
      return View();
    }

  }
}
