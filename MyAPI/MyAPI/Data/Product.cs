using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
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

        [ForeignKey(nameof(Category))]
        public int? CategoryId { get; set; }
        public virtual Category Category { get; set; }

        public string ImgUrl { get; set; }
        public string LastUpdate { get; set; }
        public virtual ICollection<APIUser> FavoritedUsers { get; set; }

        public virtual ICollection<Review> Reviews { get; set; }

        public int Status { get; set; }
        public Product()
        {
            FavoritedUsers = new HashSet<APIUser>();
        }

    }
}
