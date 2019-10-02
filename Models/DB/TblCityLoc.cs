using System;
using System.Collections.Generic;

namespace vwcom.Models.DB
{
    public partial class TblCityLoc
    {
        public int PkGeoNameId { get; set; }
        public string ContinentStr { get; set; }
        public string CountryStr { get; set; }
        public string StateProvinceStr { get; set; }
        public string CountyPrefectCantonStr { get; set; }
        public string CityStr { get; set; }
        public DateTime CreatedDtm { get; set; }
    }
}
