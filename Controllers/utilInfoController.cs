using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Net;
using System.Net.Http;
using vwcom.Models.DB;
using vwcom.Services;
using Newtonsoft.Json;
using vwcom.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace vwcom.Controllers
{
    [Route("api/[controller]")]
    public class utilInfoController : WebApiController
    {
        private  readonly vwcomContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public utilInfoController(vwcomContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            this._dbContext = dbContext;
            this._httpContextAccessor = httpContextAccessor;
        }
        // GET: api/<controller>/1 or 2 or 3...
        [HttpGet("{id}")]
        public string Get(int id)
        {
            string myRtn = String.Empty;
            switch(id)
            {
                case 1:
                    FileUtilService myFileUtil1 = new FileUtilService();
                    myRtn = JsonConvert.SerializeObject(myFileUtil1.getImgList());
                    break;
                case 2:
                    FileUtilService myFileUtil2 = new FileUtilService();
                    myRtn = JsonConvert.SerializeObject(myFileUtil2.getStatesOneTemplates());
                    break;
                case 3:
                    DbUtilServices myDbUtil3 = new DbUtilServices(this._dbContext);
                    myRtn=myDbUtil3.getStatesRnd();
                    break;
                case 4:
                  FileUtilService myFileUtil4 = new FileUtilService();
                  myRtn = JsonConvert.SerializeObject(myFileUtil4.getStatesTwoTemplates());
                  break;
                default:
                  break;
  }
            return myRtn;
        }

        // POST api/<controller>
        [HttpPost]
        public IActionResult Post()
        {
            ActionResult myRtn = NotFound("No valid object id.");

            string inputStr = String.Empty;

            using (
                    StreamReader sr = new StreamReader(_httpContextAccessor.HttpContext.Request.Body)
            )
            {
                inputStr = sr.ReadToEnd();
            }

            HttpPostMessageService myHelper = new HttpPostMessageService();
            HttpPostMessageHelper.allType myObj = myHelper.msgTypeFactory(inputStr);
            switch (myObj.id)
            {
                case 1:
                    HttpPostMessageHelper.typeOne msg1;
                    msg1 = (HttpPostMessageHelper.typeOne)myObj;
                    EmailUtilService emailSvc = new EmailUtilService(msg1.subject, msg1.message);
                    webResult result = emailSvc.send();
                    if (result.status == HttpStatusCode.OK)
                    {
                        myRtn = new OkObjectResult(HttpStatusCode.OK);
                    }
                    else
                    {
                        myRtn = BadRequest(result.msg);
                    }
                    break;
                default:
                    break;
            }
            return myRtn;
        }
        /*
        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        */
    }
}
