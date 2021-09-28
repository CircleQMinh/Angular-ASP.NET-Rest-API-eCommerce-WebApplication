using MyAPI.Data;
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
        public OrderDTO Order { get; set; }
        public string ShipperID { get; set; }
        public virtual UserInfoDTO Shipper { get; set; }
        public string deliveryDate { get; set; }
    }
    public class ShortShippingInfo
    {
        public string ShipperID { get; set; }
        public virtual UserInfoDTO Shipper { get; set; }
        public string deliveryDate { get; set; }
    }
    public class FinishOrderDTO
    {
        public string shipperId { get; set; }
        public int orderId { get; set; }
        public int status { get; set; }
        public string date { get; set; }
        public string note { get; set; }
    }
}
