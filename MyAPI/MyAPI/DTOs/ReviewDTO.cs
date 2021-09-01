using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class ReviewDTO : CreateReviewDTO
    {

        public virtual ReviewUserInfoDTO User { get; set; }
    }

    public class CreateReviewDTO
    {
        public int Star { get; set; }
        public string Content { get; set; }

        public int ProductId { get; set; }
        public string UserID { get; set; }

        public string Date { get; set; }

    }

}
