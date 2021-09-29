using MyAPI.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class OrderDetailDTO
    {
      
   

        public int ProductId { get; set; }

        public int Quantity { get; set; }
    }
    public class TKOrderDetailDTO : OrderDetailDTO
    {
        public Product Product { get; set; }
    }
    public class CreateOrderDetailDTO : OrderDetailDTO
    {
        public int OrderId { get; set; }
    }

    public class FullOrderDetailDTO  : OrderDetailDTO
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public CreateProductDTO Product { get; set; }

    }

}
