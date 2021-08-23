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

        IGenericRepository<OrderDetail> OrderDetails { get; }

        Task Save();
    }
}
