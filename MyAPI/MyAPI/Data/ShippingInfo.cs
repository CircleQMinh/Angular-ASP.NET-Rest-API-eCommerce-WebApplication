using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Data
{
    public class ShippingInfo

    {
        public int Id { get; set; }
        [ForeignKey(nameof(Order))]
        public int OrderId { get; set; }
        public Order Order { get; set; }
        [ForeignKey(nameof(ShipperID))]
        public string ShipperID { get; set; }
        public virtual APIUser Shipper { get; set; }

        public string deliveryDate { get; set; }
    }
}
