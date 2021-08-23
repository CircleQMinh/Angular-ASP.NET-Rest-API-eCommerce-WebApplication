using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Data
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
        public int UnitInStock { get; set; }
        public string Category { get; set; }
        public string ImgUrl { get; set; }
      
       
 
        public string LastUpdate { get; set; }

    }
}
