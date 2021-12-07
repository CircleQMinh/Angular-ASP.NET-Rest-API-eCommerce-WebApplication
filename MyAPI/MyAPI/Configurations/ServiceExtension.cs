
using MyAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyAPI.IRepository;

namespace MyAPI.Configurations
{
    public static class ServiceExtensions
    {
      
        public static void ConfigureIdentity(this IServiceCollection services)
        {
           
        }

        public static void ConfigureJWT(this IServiceCollection services, IConfiguration Configuration)
        {

        }
    }

    //public class CategoryRepository<T> : IGenericRepository<T> where T : Category
    //{
    //    public Task Delete(int id)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public void DeleteRange(IEnumerable<T> entities)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task<T> Get(System.Linq.Expressions.Expression<Func<T, bool>> expression, List<string> includes = null)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task<IList<T>> GetAll(System.Linq.Expressions.Expression<Func<T, bool>> expression = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, List<string> includes = null)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task<IList<T>> GetAll(System.Linq.Expressions.Expression<Func<T, bool>> expression = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, List<string> includes = null, PaginationFilter validFilter = null)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task<IList<T>> GetAllDistinct(System.Linq.Expressions.Expression<Func<T, bool>> expression = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, List<string> includes = null)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task<IList<T>> GetAllDistinct(System.Linq.Expressions.Expression<Func<T, bool>> expression = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, List<string> includes = null, PaginationFilter validFilter = null)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task<double> GetAverage(System.Linq.Expressions.Expression<Func<T, bool>> expression = null, System.Linq.Expressions.Expression<Func<T, decimal>> prop = null)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task<int> GetCount(System.Linq.Expressions.Expression<Func<T, bool>> expression = null)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task<double> GetMax(System.Linq.Expressions.Expression<Func<T, bool>> expression = null, System.Linq.Expressions.Expression<Func<T, decimal>> prop = null)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task<double> GetMin(System.Linq.Expressions.Expression<Func<T, bool>> expression = null, System.Linq.Expressions.Expression<Func<T, decimal>> prop = null)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task Insert(T entity)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public Task InsertRange(IEnumerable<T> entities)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public void Update(T entity)
    //    {
    //        throw new NotImplementedException();
    //    }
    //}
}
