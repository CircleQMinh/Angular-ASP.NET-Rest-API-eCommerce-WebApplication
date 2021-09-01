using MyAPI.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.IRepository
{
    public interface IUnitOfWork
    {
        IGenericRepository<Product> Products { get; }
        IGenericRepository<Order> Orders { get; }
        IGenericRepository<APIUser> Users { get; }
        IGenericRepository<OrderDetail> OrderDetails { get; }

        //IGenericRepository<APIUserProduct> APIUserProducts { get; }
        IGenericRepository<ShippingInfo> ShippingInfos { get; }

        IGenericRepository<Review> Reviews { get; }

        Task Save();
    }
}
