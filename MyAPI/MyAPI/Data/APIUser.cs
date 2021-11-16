using Microsoft.AspNetCore.Identity;
using MyAPI.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Data
{
    public class APIUser:IdentityUser  
    {
        public string DisplayName { get; set; }
        public string imgUrl { get; set; }
        public int Coins { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Product> FavoriteProducts { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public APIUser()
        {
            FavoriteProducts = new HashSet<Product>();
        }

    }
}
