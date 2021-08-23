using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyAPI.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Seed
{
    public class ProductConfig : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            //builder.HasData(
            //    new Product
            //    {
            //        Id = 1,
            //        Name = "Box",
            //        Description = "JM",
            //        Price = 23000,
            //        Category = "Test",
            //        ImgUrl="",
            //        LastUpdate="",
            //        UnitInStock=1
                    
            //    },
            //    new Product
            //    {
            //        Id = 2,
            //        Name = "Pillow",
            //        Description = "PL",
            //        Price = 33000,
            //        Category = "Test",
            //        ImgUrl = "",
            //        LastUpdate = "",
            //        UnitInStock = 1
            //    },
            //    new Product
            //    {
            //        Id = 3,
            //        Name = "Card",
            //        Description = "Card",
            //        Price = 45000,
            //        Category = "Test",
            //        ImgUrl = "",
            //        LastUpdate = "",
            //        UnitInStock = 1
            //    }
            //);
        }
    }
}
