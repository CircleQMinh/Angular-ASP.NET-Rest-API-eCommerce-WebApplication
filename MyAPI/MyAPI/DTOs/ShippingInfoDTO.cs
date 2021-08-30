using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class ShippingInfoDTO
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string ShipperID { get; set; }
    }
}
