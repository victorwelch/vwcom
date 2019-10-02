using System;
using System.Collections.Generic;

namespace vwcom.Models.DB
{
    public partial class TblCityIpv4Blocks
    {
        public byte[] IpLowerBin { get; set; }
        public byte[] IpUpperBin { get; set; }
        public string IpLowerStr { get; set; }
        public string IpUpperStr { get; set; }
        public int FkGeoNameId { get; set; }
        public decimal? LatitudeNum { get; set; }
        public decimal? LongitudeNum { get; set; }
        public DateTime CreatedDtm { get; set; }
    }
}
