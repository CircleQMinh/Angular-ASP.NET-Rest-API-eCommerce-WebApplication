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
        private IGenericRepository<APIUser> _user;
        private IGenericRepository<ShippingInfo> _shippingInfo;
        private IGenericRepository<Review> _review;
        private IGenericRepository<EmployeeInfo> _employeeInfo;
        private IGenericRepository<Promotion> _promotion;
        private IGenericRepository<PromotionInfo> _promotionInfo;
        private IGenericRepository<Tag> _tag;
        private IGenericRepository<DiscountCode> _discountcode;
        public UnitOfWork(DatabaseContext context)
        {
            _context = context;
        }
        public IGenericRepository<Product> Products => _product ??= new GenericRepository<Product>(_context);
        public IGenericRepository<Order> Orders => _order ??= new GenericRepository<Order>(_context);
        public IGenericRepository<OrderDetail> OrderDetails => _orderDetail ??= new GenericRepository<OrderDetail>(_context);
        public IGenericRepository<APIUser> Users => _user ??= new GenericRepository<APIUser>(_context);
        public IGenericRepository<ShippingInfo> ShippingInfos => _shippingInfo ??= new GenericRepository<ShippingInfo>(_context);
        public IGenericRepository<Review> Reviews => _review ??= new GenericRepository<Review>(_context);

        public IGenericRepository<EmployeeInfo> EmployeeInfos => _employeeInfo ??= new GenericRepository<EmployeeInfo>(_context);
        public IGenericRepository<Promotion> Promotions => _promotion ??= new GenericRepository<Promotion>(_context);
        public IGenericRepository<PromotionInfo> PromotionInfos => _promotionInfo ??= new GenericRepository<PromotionInfo>(_context);
        public IGenericRepository<Tag> Tags => _tag ??= new GenericRepository<Tag>(_context);

        public IGenericRepository<DiscountCode> DiscountCodes => _discountcode ??= new GenericRepository<DiscountCode>(_context);
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
