using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MyAPI.Configurations;
using MyAPI.Data;
using MyAPI.DTOs;
using MyAPI.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Web;

namespace MyAPI.Controllers
{
    //public class Test
    //{
    //    public string Name { get; set; }

    //    public int Age { get; set; }
    //}

    [Route("api/[controller]")]
    [ApiController]
    public class productController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<productController> _logger;
        public productController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<productController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        //[HttpGet("GetPerson")]
        //public string GetQueryParams([FromQuery] Test person)
        //{
        //    return person.Name + " " + person.Age;
        //}

        [HttpGet(Name ="GetProducts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetProducts(string category,string order,int pageNumber,int pageSize)
        {
            try
            {
                Func<IQueryable<Product>, IOrderedQueryable<Product>> orderBy = null;
                Expression<Func<Product, bool>> expression = null;
                switch (order)
                {
                    case "Price":
                        orderBy = a => a.OrderBy(x => x.Price);
                        break;
                    case "Name":
                        orderBy = a => a.OrderBy(x => x.Name);
                        break;
                }
                if (category!="all")
                {
                    expression = q => q.Category == category;
                }
                PaginationFilter pf = new PaginationFilter(pageNumber, pageSize);
                var query = await _unitOfWork.Products.GetAll(expression, orderBy, null,pf);
                var totalItem = await _unitOfWork.Products.GetCount(expression);
                var results = _mapper.Map<IList<ProductDTO>>(query);
         


                return Ok(new { results, totalItem });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetProducts)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later."+"\n"+ex.ToString());
            }
        }

        //thiết lập endpoint của api
        [HttpGet("{id:int}", Name = "GetProduct")] 
        //thiết lập hình thức trả lời của api
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        //hàm mà api sẽ gọi
        public async Task<IActionResult> GetProduct(int id)//nhận vào 1 id
        {
            try
            {
                // câu truy vấn sử dụng repo Products
                var query = await _unitOfWork.Products.Get(q => q.Id == id,new List<string> { "FavoritedUsers"});
                // sử dụng mapper để map dữ liệu thành 1 DTO(data tranfer object)
                var result = _mapper.Map<FullProductDTO>(query);
                // câu truy vấn 2 sử dụng repo Reviews
                var query2 = await _unitOfWork.Reviews.GetAll(q => q.ProductId == id,null, new List<string> { "User" });
                //sử dụng mapper
                var reviews = _mapper.Map<IList<ReviewDTO>>(query2);
                //trả lời request
                return Ok(new { result,reviews });
            }
            catch (Exception ex)
            {
                //nếu có lỗi
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later."+ex.ToString());
            }
        }


        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(CreateProduct)}");
                return BadRequest(ModelState);
            }

            try
            {
                var query = _mapper.Map<Product>(unitDTO);
                await _unitOfWork.Products.Insert(query);
                await _unitOfWork.Save();

                return Accepted(new { query });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(CreateProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }


        [HttpPut("{id:int}",Name ="UpdateProduct")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] CreateProductDTO unitDTO)
        {
            if (!ModelState.IsValid || id < 1)
            {
                _logger.LogError($"Invalid UPDATE attempt in {nameof(UpdateProduct)}");
                return BadRequest(ModelState);
            }

            try
            {
                var query = await _unitOfWork.Products.Get(q => q.Id == id);
                if (query == null)
                {
                    _logger.LogError($"Invalid UPDATE attempt in {nameof(UpdateProduct)}");
                    return BadRequest("Submitted data is invalid");
                }

                _mapper.Map(unitDTO, query);
                _unitOfWork.Products.Update(query);
                await _unitOfWork.Save();
                query = await _unitOfWork.Products.Get(q => q.Id == id);
                return Accepted(new { query });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(UpdateProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }



        [HttpDelete("{id:int}",Name ="DeleteProduct")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (id < 1)
            {
                _logger.LogError($"Invalid DELETE attempt in {nameof(DeleteProduct)}");
                return BadRequest();
            }

            try
            {
                var country = await _unitOfWork.Products.Get(q => q.Id == id);
                if (country == null)
                {
                    _logger.LogError($"Invalid DELETE attempt in {nameof(DeleteProduct)}");
                    var error = "Submitted data is invalid";
                    return BadRequest(new { error});
                }

                await _unitOfWork.Products.Delete(id);
                await _unitOfWork.Save();

                var success = true;

                return Accepted(new { success });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(DeleteProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }



        [HttpGet("search",Name = "SearchProducts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SearchProducts(string keyword, string priceRange,  string category)
        {
            if (!ModelState.IsValid )
            {
                _logger.LogError($"Invalid attempt in {nameof(SearchProducts)}");
                return BadRequest(ModelState);
            }
            try
            {
                string[] range = priceRange.Split(",");
                string[] cate = category.Split(",");

                var query = await _unitOfWork.Products.GetAll(q => q.Name.Contains(keyword),null,null);
                var list = _mapper.Map<IList<ProductDTO>>(query);
                var rs = new List<ProductDTO>();
                foreach (var item in list)
                {
                    if ((cate.Contains(item.Category) || cate.Contains("all")) && item.Price > Int32.Parse(range[0]) && item.Price < Int32.Parse(range[1]))
                    {
                        rs.Add(item);
                    }
                }
                return Ok(new {result=rs,total=rs.Count  });
            }


            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetProducts)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }


    }
}
