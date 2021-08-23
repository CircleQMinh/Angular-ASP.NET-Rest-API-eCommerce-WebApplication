using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Data
{
    public class Order
    {
        public int Id { get; set; }
        [ForeignKey(nameof(UserID))]
        public string UserID { get; set; }
        public virtual APIUser User { get; set; }
        public string ContactName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string PaymentMethod { get; set; }
        public string OrderDate { get; set; }
        public int TotalItem { get; set; }
        public double TotalPrice { get; set; }

        public int Status { get; set; }
        public string Note { get; set; }
        public virtual IList<OrderDetail> OrderDetails { get; set; }
    }
}
