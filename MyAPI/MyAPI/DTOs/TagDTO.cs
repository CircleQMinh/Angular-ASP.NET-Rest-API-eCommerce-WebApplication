using MyAPI.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class CreateTagDTO
    {
        public string Name { get; set; }
        public int ProductId { get; set; }
    }
    public class TagDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
    }
    public class FullTagDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}
