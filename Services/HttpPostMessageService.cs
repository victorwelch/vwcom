using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using vwcom.Models;

namespace vwcom.Services
{
    public interface IHttpPostMessageService
    {
       HttpPostMessageHelper.allType msgTypeFactory(string inputStr);
    }
    public class HttpPostMessageService : IHttpPostMessageService
    {
        private HttpPostMessageHelper _helper = new HttpPostMessageHelper();
        public HttpPostMessageHelper.allType msgTypeFactory(string inputStr)
        {
            HttpPostMessageHelper.allType myRtn = _helper.PostMessageTypeFactory(inputStr);
            return myRtn;
        }
    }
}
