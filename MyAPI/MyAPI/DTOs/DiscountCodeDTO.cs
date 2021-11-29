using MyAPI.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class DiscountCodeDTO
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public string Code { get; set; }
        public string DiscountPercent { get; set; }
        public string DiscountAmount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int Status { get; set; }
    }

    public class CreateDiscountCodeDTO
    {
        public string DiscountPercent { get; set; }
        public string DiscountAmount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int Status { get; set; }
        public string Code { get; set; }
    }
    public class AutoCreateDiscountCodeDTO
    {
        public string DiscountPercent { get; set; }
        public string DiscountAmount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int Number { get; set; }
    }
    public class ApplyDiscountCode { 

        public string Code { get; set; }
        public int OrderID { get; set; }
    }

    
}
