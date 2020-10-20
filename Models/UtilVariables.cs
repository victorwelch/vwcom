using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace vwcom.Models
{
    public class UtilVariables
    {
        public static IConfiguration Configuration { get; set;  }
        public static IWebHostEnvironment HostingEnvironment { get; set; }
        public static HttpContext Context { get; set; }
        public static String BaseUrl() {
            string myRtn = String.Empty;
            if (!(Context is null)) {
                var _Request = Context.Request;
                if (!(_Request is null)) {
                    myRtn = $"{_Request.Scheme}://{_Request.Host}{_Request.PathBase}";
                }
            }
            return myRtn;
        }
  }
}
