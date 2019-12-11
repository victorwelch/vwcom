using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Hosting;
using vwcom.Exceptions;
using Microsoft.Extensions.FileProviders;
using System.Net.Mail;
using Newtonsoft.Json;
using System.Net;

namespace vwcom.Models
{
    public class FileUtilHelper
    {
        private IWebHostEnvironment _hostenv;
        public FileUtilHelper(IWebHostEnvironment hostenv)
        {
            this._hostenv = hostenv;
        }
        public string getWebMapPath(string arg = null)
        {
            string myResult = string.Empty;
            try
            {
                arg = ((arg == null) || !(arg.StartsWith(@"/"))) ? @"/" + arg : arg;
                myResult = Path.Combine(_hostenv.WebRootPath, arg);
            }
            catch (Exception ex)
            {
                Exception myEx = new IUtilException("victorwelch.com: \"getWebMapPath\" failure!",ex);
                throw myEx;
            }
            return myResult;
        }
        public List<string> getImgList()
        {
            List<string> myRtn = new List<string>();
            try
            {
                IDirectoryContents myDirInfo = _hostenv.WebRootFileProvider.GetDirectoryContents(@"bgImages");
                foreach (IFileInfo fInfo in myDirInfo)
                {
                    myRtn.Add(@"/bgImages/" + fInfo.Name);
                }
            }
            catch (Exception ex)
            {
                Exception myEx = new IUtilException("victorwelch.com: \"getImgList\" failure!", ex);
                throw myEx;
            }
            return myRtn;
        }
        public List<string> getStatesOneTemplates()
        {
            List<string> myRtn = new List<string>();
            try
            {
                IDirectoryContents myDirInfo = _hostenv.WebRootFileProvider.GetDirectoryContents(@"templates");
                foreach (IFileInfo fInfo in myDirInfo)
                {
                    if (fInfo.Name.StartsWith("statesOne"))
                    {
                        myRtn.Add(File.ReadAllText(fInfo.PhysicalPath));
                    }
                }
            }
            catch (Exception ex)
            {
                Exception myEx = new IUtilException("victorwelch.com: \"getStatesOneTemplate\" failure!", ex);
                throw myEx;
            }
            return myRtn;
        }
        public List<string> getStatesTwoTemplates()
        {
            List<string> myRtn = new List<string>();
            try
            {
              IDirectoryContents myDirInfo = _hostenv.WebRootFileProvider.GetDirectoryContents(@"templates");
              foreach (IFileInfo fInfo in myDirInfo)
              {
                if (fInfo.Name.StartsWith("statesTwo"))
                {
                  myRtn.Add(File.ReadAllText(fInfo.PhysicalPath));
                }
              }
          }
          catch (Exception ex)
          {
              Exception myEx = new IUtilException("victorwelch.com: \"getStatesTwoTemplate\" failure!", ex);
              throw myEx;
          }
          return myRtn;
    }
  }

    public class webResult
    {
        public HttpStatusCode status;
        public string msg;
        public webResult(HttpStatusCode _status, string _message)
        {
            this.status = _status;
            this.msg = _message;
        }
        public webResult(emailResult _emailResult)
        {
            if ((int)_emailResult.status < 0) {
                this.status = HttpStatusCode.BadRequest;
            } else {
                this.status = HttpStatusCode.OK;
            }
            this.msg = _emailResult.msg;
        }
    }
    public class EmailUtilHelper
    {
        private EmailModel _email;
        public EmailUtilHelper(
            string subj,
            [DataType(DataType.MultilineText)] string msg
        )
        {
            this._email = new EmailModel(subj, msg);
        }
        public webResult send()
        {
            emailResult myEmailResult = _email.send();
            webResult myRtn = new webResult(myEmailResult);
            return myRtn;
        }
    }

    public class HttpPostMessageHelper
    {
        public class allType
        {
            public int id;
        }
        public class typeOne : allType
        {
            public string subject;
            public string message;
        }
        public class typeTwo : allType
        {
            public string dummy;
        }
        public allType PostMessageTypeFactory(string inputStr)
        {
            allType myRtn = new allType();
            var inputObj = JsonConvert.DeserializeObject(inputStr);

            int id;
            try {
                id = (int)((dynamic)inputObj)["id"].Value;
            } catch (Exception ex) {
                id = -1;
            }
            switch(id) {
                case 1:
                    myRtn = JsonConvert.DeserializeObject<typeOne>(inputStr);
                    break;
                case 2:
                    myRtn = JsonConvert.DeserializeObject<typeTwo>(inputStr);
                    break;
                default:
                    myRtn.id = id;
                    break;
            }
            return myRtn;
        }
    }
}

