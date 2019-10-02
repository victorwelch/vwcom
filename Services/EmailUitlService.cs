using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using vwcom.Models;
using System.Net;

namespace vwcom.Services
{
    public interface IEmailUtilService
    {
        webResult send();
    }
    public class EmailUtilService : IEmailUtilService
    {
        private EmailUtilHelper _emailHelper;
        public EmailUtilService(
            string subj,
            [DataType(DataType.MultilineText)] string msg
        )
        {
            this._emailHelper = new EmailUtilHelper(subj, msg);
        }
        public webResult send()
        {
            webResult myRtn = this._emailHelper.send();
            return myRtn;
        }
    }
}
