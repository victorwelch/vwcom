using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace vwcom.Exceptions
{
    public class IUtilException : Exception
    {
        public IUtilException()
        {
        }

        public IUtilException(string message)
            : base(message)
        {
        }

        public IUtilException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
