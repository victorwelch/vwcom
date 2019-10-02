using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using vwcom.Exceptions;
using Microsoft.Extensions.FileProviders;
using vwcom.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace vwcom.Services
{
    public interface IFileUtilService
    {
        string getWebMapPath(string arg = null);
        List<string> getImgList();
    }
    public class FileUtilService : IFileUtilService
    {
        private FileUtilHelper myUtilHelper;
        public FileUtilService()
        {
            myUtilHelper = new FileUtilHelper(UtilVariables.HostingEnvironment);
        }
        public string getWebMapPath(string arg = null)
        {
            string myRtn = String.Empty;
            myRtn = this.myUtilHelper.getWebMapPath(arg);
            return myRtn;
        }
        public List<string> getImgList()
        {
            List<string> myRtn = new List<string>();
            myRtn = this.myUtilHelper.getImgList();
            return myRtn;
        }
        public List<string> getStatesOneTemplates()
        {
            List<string> myRtn = new List<string>();
            myRtn = this.myUtilHelper.getStatesOneTemplates();
            return myRtn;
        }
    }
}
