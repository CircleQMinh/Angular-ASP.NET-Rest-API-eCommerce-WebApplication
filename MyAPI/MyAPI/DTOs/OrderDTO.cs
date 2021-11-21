using MyAPI.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class FullOrderDTO
    {
        public string UserID { get; set; }
        public virtual UserInfoDTO User { get; set; }
        public string ContactName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string PaymentMethod { get; set; }
        public string OrderDate { get; set; }
        public int TotalItem { get; set; }
        public double TotalPrice { get; set; }
        public string Note { get; set; }
        public int Status { get; set; }
        public virtual IList<OrderDetailDTO> OrderDetails { get; set; }

    }

    public class BasicOrderDTO
    {
        public string UserID { get; set; }
        public string ContactName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string PaymentMethod { get; set; }
        public string OrderDate { get; set; }
        public int TotalItem { get; set; }
        public double TotalPrice { get; set; }
        public string Note { get; set; }
        public int Status { get; set; }
        public virtual IList<OrderDetailDTO> OrderDetails { get; set; }
        public int ShippingFee { get; set; }
        public DiscountCode discountCode { get; set; }
    }

    public class CreateOrderDTO
    {
        public string UserID { get; set; }
        public string ContactName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string PaymentMethod { get; set; }
        public string OrderDate { get; set; }
        public int TotalItem { get; set; }
        public double TotalPrice { get; set; }
        public string Note { get; set; }
        public int Status { get; set; }
        public int ShippingFee { get; set; }
    }

    public class UpdateOrderDTO
    {
        public string ContactName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string PaymentMethod { get; set; }
        public string OrderDate { get; set; }
        public int TotalItem { get; set; }
        public double TotalPrice { get; set; }
        public string Note { get; set; }
        public int Status { get; set; }
    }

    public class OrderDTO : BasicOrderDTO
    {
        public int Id { get; set; }
    }
    public class CancelOrderDTO 
        
    {
        public int Id { get; set; }
        public string Note { get; set; }
    }
}
