using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;

namespace vwcom.Models
{
    public class UtilVariables
    {
        public static IConfiguration Configuration { get; set;  }
        public static IHostingEnvironment HostingEnvironment { get; set; }
    }
}
