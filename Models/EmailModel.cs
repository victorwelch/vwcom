using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Net.Mail;

namespace vwcom.Models
{
    public class emailResult
    {
        public SmtpStatusCode status;
        public string msg;
        public emailResult(SmtpStatusCode _status, string _message)
        {
            this.status = _status;
            this.msg = _message;
        }
    }
    public class EmailModel
    {
        public string subject { get; set; }

        [DataType(DataType.MultilineText)]
        public string message { get; set; }
        private MailMessage mmsg = new MailMessage();
        public EmailModel(
                string subject,
                [DataType(DataType.MultilineText)] string message
        )
        {
            this.subject = subject;
            this.message = message;
        }
        public emailResult send()
        {
            emailResult myRtn = new emailResult(SmtpStatusCode.Ok, String.Empty);
            try
            {
                mmsg.To.Add(new MailAddress("victor@victorwelch.com", "vwcom"));
                mmsg.From = new MailAddress("victorwelchie@gmail.com", "gmailadmin");
                mmsg.Subject = this.subject;
                mmsg.Body = this.message;
                mmsg.IsBodyHtml = true;

                var gmailClient = new System.Net.Mail.SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    //Credentials = new System.Net.NetworkCredential("victorwelchie@gmail.com", "Vlk@123klv")
                    Credentials = new System.Net.NetworkCredential("victorwelchie@gmail.com", "Vlk@123klv")
                };
                gmailClient.Send(mmsg);
            }
            catch (Exception ex)
            {
                myRtn = new emailResult(SmtpStatusCode.GeneralFailure, ex.Message);
            }
            return myRtn;
        }
    }
}
