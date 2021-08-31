﻿using MyAPI.Data;
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

    }

    public class ProductDTO : CreateProductDTO
    {
        public int Id { get; set; }

        public static implicit operator ProductDTO(List<ProductDTO> v)
        {
            throw new NotImplementedException();
        }
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
        public virtual ICollection<UserInfoDTO> FavoritedUsers { get; set; }
    }
}
