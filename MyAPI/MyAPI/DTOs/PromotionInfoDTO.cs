using MyAPI.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class PromotionInfoDTO
    {
        public int ProductId { get; set; }
        public int PromotionId { get; set; }
        public Promotion Promotion { get; set; }
        public string PromotionPercent { get; set; }
        public string PromotionAmount { get; set; }
    }

    public class CreatePromotionInfoDTO
    {
        public int ProductId { get; set; }
        public int PromotionId { get; set; }

        public string PromotionPercent { get; set; }
        public string PromotionAmount { get; set; }
    }
}
