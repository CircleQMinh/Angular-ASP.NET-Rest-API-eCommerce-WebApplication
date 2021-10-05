using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class PromotionDTO
    {

    }

    public class CreatePromotionDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int Status { get; set; }
    }
}
