using MyAPI.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class CreateProductDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public double Price { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        [Range(1, 999)]
        public int UnitInStock { get; set; }
        [Required]
        public string Category { get; set; }
        public string ImgUrl { get; set; }
        [Required]
        public string LastUpdate { get; set; }
        [Required]
        public int Status { get; set; }
    }

    public class SearchForProductDTO
    {
        public string category { get; set; }
        public string priceRange { get; set; }
        public string keyword { get; set; }
        public string[] tag { get; set; }
    }
    public class ProductDTO : CreateProductDTO
    {
        public int Id { get; set; }


    }

    public class FullProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
        public int UnitInStock { get; set; }
        public string Category { get; set; }
        public string ImgUrl { get; set; }
        public string LastUpdate { get; set; }
        public virtual ICollection<ReviewUserInfoDTO> FavoritedUsers { get; set; }

        public virtual ICollection<ReviewDTO> Reviews { get; set; }
    }

    public class SearchProductDTO
    {
        public string keyword { get; set; }
        public List<string> categories { get; set; }

        public Dictionary<string,int> priceRange { get; set; }
    }
}
