using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Data
{
    public class PromotionInfo
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
        public Product Product { get; set; }

        [ForeignKey(nameof(Promotion))]
        public int PromotionId { get; set; }
        public Promotion Promotion { get; set; }
        public string PromotionPercent { get; set; }
        public string PromotionAmount { get; set; }
    }
}
