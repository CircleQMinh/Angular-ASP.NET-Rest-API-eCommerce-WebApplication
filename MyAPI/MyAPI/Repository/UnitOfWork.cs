using MyAPI.Data;
using MyAPI.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DatabaseContext _context;
        private IGenericRepository<Product> _product;
        private IGenericRepository<Order> _order;
        private IGenericRepository<OrderDetail> _orderDetail;
        public UnitOfWork(DatabaseContext context)
        {
            _context = context;
        }

        public IGenericRepository<Product> Products => _product ??= new GenericRepository<Product>(_context);

        public IGenericRepository<Order> Orders => _order ??= new GenericRepository<Order>(_context);

        public IGenericRepository<OrderDetail> OrderDetails => _orderDetail ??= new GenericRepository<OrderDetail>(_context);

        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }
    }
}
