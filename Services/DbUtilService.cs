using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using vwcom.Models;
using vwcom.Models.DB;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace vwcom.Services
{
    public interface IDbUspExecService
    {
        string getStatesRnd();
    }
    public class DbUtilServices : IDbUspExecService
    {
        private vwcomContext _context;
        public DbUtilServices(vwcomContext context)
        {
            this._context = context;
        }
        public string getStatesRnd()
        {               
            string myRtn = String.Empty;
            var myRtnObj = _context.UspValue.FromSql("EXECUTE uiDemo.usp$GetStatesRandom");
            myRtn = myRtnObj.ToList().First().ValueStr;
            return myRtn;
        }
    }
}
