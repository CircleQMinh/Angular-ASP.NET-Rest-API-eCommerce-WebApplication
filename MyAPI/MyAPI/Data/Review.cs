using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Data
{
    public class Review

    {
        public int Id { get; set; }

        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Star { get; set; }
        public string Content { get; set; }

        public string Date { get; set; }

        [ForeignKey(nameof(UserID))]
        public string UserID { get; set; }
        public virtual APIUser User { get; set; }
    }
}
