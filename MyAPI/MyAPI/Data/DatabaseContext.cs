using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyAPI.Seed;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Data
{
    public class DatabaseContext : IdentityDbContext<APIUser>
    {
        public DatabaseContext(DbContextOptions options) : base(options)
        { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<APIUser> Users { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }

        //public DbSet<APIUserProduct> APIUserProducts { get; set; }
        public DbSet<ShippingInfo> ShippingInfos { get; set; }

        public DbSet<Review> Reviews { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // builder.ApplyConfiguration(new ProductConfig());
            builder.ApplyConfiguration(new RoleConfig());

        }
    }
}
