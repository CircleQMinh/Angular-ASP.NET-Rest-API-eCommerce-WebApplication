using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
                    case "Status":
                        orderBy = a => a.OrderBy(x => x.Status);
                        break;
                }
                if (category!="all")
                {
                    expression = q => q.Category.Name == category&&q.Status==1;
                }
                else
                {
                    expression = q => q.Status == 1;
                }
                PaginationFilter pf = new PaginationFilter(pageNumber, pageSize);
                var query = await _unitOfWork.Products.GetAll(expression, orderBy, null,pf);
                var totalItem = await _unitOfWork.Products.GetCount(expression);
                var results = _mapper.Map<IList<ProductDTO>>(query);

                var promoInfo = new List<PromotionInfoDTO>();

                foreach (var item in results)
                {
                    var pi =  await _unitOfWork.PromotionInfos.Get(q => q.ProductId == item.Id&&q.Promotion.Status==1, new List<string> { "Promotion" });
                    var pi_map = _mapper.Map<PromotionInfoDTO>(pi);
                    promoInfo.Add(pi_map);
                }



                return Ok(new { results, totalItem,promoInfo });
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
                var query = await _unitOfWork.Products.Get(q => q.Id == id,new List<string> { "FavoritedUsers","Category","Tags"});
                // sử dụng mapper để map dữ liệu thành 1 DTO(data tranfer object)
                var result = _mapper.Map<FullProductDTO>(query);
                // câu truy vấn 2 sử dụng repo Reviews
                var query2 = await _unitOfWork.Reviews.GetAll(q => q.ProductId == id,null, new List<string> { "User" });
                //sử dụng mapper
                var reviews = _mapper.Map<IList<ReviewDTO>>(query2);

                var query3 = await _unitOfWork.PromotionInfos.Get(q => q.ProductId == id&&q.Promotion.Status==1, new List<string> { "Promotion" });

                var promoInfo = _mapper.Map<PromotionInfoDTO>(query3);

                //trả lời request
                return Ok(new { result,reviews,promoInfo,tags=result.Tags });
            }
            catch (Exception ex)
            {
                //nếu có lỗi
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later."+ex.ToString());
            }
        }


        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDTO unitDTO)
        {


            var cateAll = await _unitOfWork.Categories.GetAll(null, null, null);
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

                query = await _unitOfWork.Products.Get(q => q.Id == query.Id, new List<string> { "Category" });

                var tag = new Tag();
                tag.ProductId = query.Id;
                //tag.Product = query;
                for (int i = 0; i < cateAll.Count; i++)
                {
                    if (query.CategoryId == cateAll[i].Id)
                    {
                        tag.Name = cateAll[i].Name;
                        break;
                    }
                }
                await _unitOfWork.Tags.Insert(tag);
                await _unitOfWork.Save();
                return Accepted(new { query });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(CreateProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later."+ex.ToString());
            }
        }

        [Authorize(Roles = "Administrator")]
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
                return StatusCode(500, "Internal Server Error. Please Try Again Later."+ex.ToString());
            }
        }


        [Authorize(Roles = "Administrator")]
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



        [HttpPost("search",Name = "SearchProducts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SearchProducts([FromBody] SearchForProductDTO unitDTO)
        {
            if (!ModelState.IsValid )
            {
                _logger.LogError($"Invalid attempt in {nameof(SearchProducts)}");
                return BadRequest(ModelState);
            }
            try
            {
                string[] range = unitDTO.priceRange.Split(",");
                string cate = unitDTO.category;
                var count=0;
                Expression<Func<Product, bool>> expression = null;
                if (unitDTO.keyword=="")
                {
                    unitDTO.keyword = " ";
                }

                if (cate!="all")
                {
                    if (unitDTO.tag != "all")
                    {
                        //var tags = await _unitOfWork.Tags.GetAll(q => q.Name == unitDTO.tag, null,null);
                        expression = q => q.Category.Name == cate && q.Price >= Int32.Parse(range[0]) && q.Price <= Int32.Parse(range[1])&&q.Tags.Any(k=>k.Name==unitDTO.tag)&&q.Name.Contains(unitDTO.keyword);
                        count = await _unitOfWork.Products.GetCount(expression);
                    }
                    else
                    {
                        expression = q => q.Category.Name == cate && q.Price >= Int32.Parse(range[0]) && q.Price <= Int32.Parse(range[1]) && q.Name.Contains(unitDTO.keyword);
                        count = await _unitOfWork.Products.GetCount(expression);
                    }
                }
                else
                {
                    if (unitDTO.tag != "all")
                    {
                        //var tags = await _unitOfWork.Tags.GetAll(q => q.Name == unitDTO.tag, null,null);
                        expression = q => q.Price >= Int32.Parse(range[0]) && q.Price <= Int32.Parse(range[1]) && q.Tags.Any(k => k.Name == unitDTO.tag) && q.Name.Contains(unitDTO.keyword);
                        count = await _unitOfWork.Products.GetCount(expression);
                    }
                    else
                    {
                        expression = q => q.Price >= Int32.Parse(range[0]) && q.Price <= Int32.Parse(range[1]) && q.Name.Contains(unitDTO.keyword);
                        count = await _unitOfWork.Products.GetCount(expression);
                    }
            
                }
                var query = await _unitOfWork.Products.GetAll(expression,null,new List<string>{"Category","Tags"},new PaginationFilter(unitDTO.pageNumber,unitDTO.pageSize));
                var rs = _mapper.Map<IList<FullProductDTO>>(query);
                var promoInfo = new List<PromotionInfoDTO>();
                foreach (var item in rs)
                {
                    var pi = await _unitOfWork.PromotionInfos.Get(q => q.ProductId == item.Id && q.Promotion.Status == 1, new List<string> { "Promotion" });
                    var pi_map = _mapper.Map<PromotionInfoDTO>(pi);
                    promoInfo.Add(pi_map);
                }

                return Accepted(new { result = rs, total = count, promoInfo });   
      
            }


            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetProducts)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }

        [HttpGet("getRandomProduct")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetRandomProduct(int id,string category,int number)
        {
            Expression<Func<Product, bool>> expression = null;

            try
            {
                if (category!="all")
                {
                    expression = q => q.Category.Name == category&&q.Id!=id;
                }
                else
                {
                    expression = q => q.Id != id;
                }
                var query = await _unitOfWork.Products.GetAll(expression, null, null);
                var list = _mapper.Map<IList<ProductDTO>>(query);
                var random = list.OrderBy(x => Guid.NewGuid()).ToList();
                var result = new List<ProductDTO>();
                if (number>list.Count)
                {
                    number = list.Count;
                }
                for (int i=0;i<number;i++)
                {
                    result.Add(random[i]);
                }

                return Accepted(new { result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetRandomProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }

        [HttpGet("getTopProduct")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTopProduct(int top)
        {


            try
            {
                var pro = await _unitOfWork.OrderDetails.GetAll(q => q.Order.Status == 3, null, new List<string> { "Product" });
                var pro_map = _mapper.Map<IList<TKOrderDetailDTO>>(pro);

                var result = new List<TKOrderDetailDTO>();
                foreach (var item in pro_map)
                {
                    var exist = false;

                    for (int i = 0; i < result.Count; i++)
                    {
                        if (result[i].ProductId == item.ProductId)
                        {
                            exist = true;
                            break;
                        }
                    }
                    if (exist)
                    {
                        for (int j = 0; j < result.Count; j++)
                        {
                            if (result[j].ProductId == item.ProductId)
                            {
                                result[j].Quantity += item.Quantity;
                            }
                        }
                    }
                    else
                    {
                        result.Add(item);
                    }



                }
                result.Sort((a, b) => b.Quantity - a.Quantity);
                var maxCount = result.Max(q => q.Quantity);
                var promoInfo = new List<PromotionInfoDTO>();
                foreach (var item in result.Take(top))
                {
                    var product = await _unitOfWork.Products.Get(q => q.Id == item.Product.Id, new List<string> { "Category" });
                    var pi = await _unitOfWork.PromotionInfos.Get(q => q.ProductId == item.Product.Id && q.Promotion.Status == 1, new List<string> { "Promotion" });
                    var pi_map = _mapper.Map<PromotionInfoDTO>(pi);
                    item.Product = product;
                    promoInfo.Add(pi_map);
                }

                return Accepted(new { result = result.Take(top),max=maxCount,promoInfo });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetTopProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }

        [HttpGet("getLatestProduct")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetLatestProduct(int top)
        {


            try
            {
                var pro = await _unitOfWork.Products.GetAll(q => q.Status == 1, q=>q.OrderByDescending(q=>q.Id), new List<string> { "Category"},new PaginationFilter(1,top));
                var result = _mapper.Map<IList<ProductDTO>>(pro);

                var promoInfo = new List<PromotionInfoDTO>();
                foreach (var item in result)
                {
                    var pi = await _unitOfWork.PromotionInfos.Get(q => q.ProductId == item.Id && q.Promotion.Status == 1, new List<string> { "Promotion" });
                    var pi_map = _mapper.Map<PromotionInfoDTO>(pi);
                    promoInfo.Add(pi_map);
                }

                return Accepted(new {result,promoInfo });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetLatestProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }

        [HttpGet("getMostFavoriteProduct")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetMostFavoriteProduct(int top)
        {


            try
            {
                var pro = await _unitOfWork.Products.GetAll(q => q.Status == 1, q => q.OrderByDescending(q => q.FavoritedUsers.Count), 
                    new List<string> { "FavoritedUsers","Category" }, new PaginationFilter(1, top));
                var numberFav = new List<int>();
                foreach (var item in pro)
                {
                    numberFav.Add(item.FavoritedUsers.Count);
                }

                var result = _mapper.Map<IList<ProductDTO>>(pro);

                var promoInfo = new List<PromotionInfoDTO>();
                foreach (var item in result)
                {
                    var pi = await _unitOfWork.PromotionInfos.Get(q => q.ProductId == item.Id && q.Promotion.Status == 1, new List<string> { "Promotion" });
                    var pi_map = _mapper.Map<PromotionInfoDTO>(pi);
                    promoInfo.Add(pi_map);
                }

                return Accepted(new { result,numberFav,promoInfo });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetLatestProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }
        


        [HttpGet("getPromotion")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPromotionOnGoing()
        {
            try
            {
                var query = await _unitOfWork.Promotions.GetAll(q=>q.Visible==1, null, null);
                var result = _mapper.Map<IList<PromotionDTO>>(query);
                return Accepted(new { result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetPromotionOnGoing)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }

        [HttpGet("getPromotionInfo/{id:int}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPromotionInfo(int id)
        {


            try
            {
                var query = await _unitOfWork.Promotions.Get(q => q.Id == id, null);
                if (query==null)
                {
                    var msg = "Không tìm thấy thông tin";
                    return BadRequest(msg);
                }
                var result = _mapper.Map<PromotionDTO>(query);

                var query2 = await _unitOfWork.PromotionInfos.GetAll(q => q.PromotionId == id, null, new List<string> { "Product" });
                var promoInfo = _mapper.Map<IList<PromotionInfoDTO>>(query2);


                return Accepted(new { result,promoInfo });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetPromotionInfo)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }


        [HttpGet("getRelatedPromotionInfo/{id:int}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetRelatedPromotionInfo(int id,int number)
        {
            try
            {
                var query = await _unitOfWork.Promotions.GetAll(q => q.Id != id && q.Visible == 1,null, null);
                var list = _mapper.Map<IList<PromotionDTO>>(query);
                var random = list.OrderBy(x => Guid.NewGuid()).ToList();
                var result = new List<PromotionDTO>();
                if (number > list.Count)
                {
                    number = list.Count;
                }
                for (int i=0;i<number;i++)
                {
                    result.Add(list[i]);
                }
                return Accepted(new { result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetPromotionInfo)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }


        [HttpGet("getCategory")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCategory()
        {
            try
            {
                var cate = await _unitOfWork.Categories.GetAll(null, null, null);

                return Accepted(new { cate });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetCategory)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }

        //[HttpGet("testLinQ")]
        //[ProducesResponseType(StatusCodes.Status400BadRequest)]
        //[ProducesResponseType(StatusCodes.Status201Created)]
        //[ProducesResponseType(StatusCodes.Status500InternalServerError)]
        //public async Task<IActionResult> TestLinQ(string category)
        //{
        //    Expression<Func<Product, bool>> expression = null;

        //    try
        //    {


        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetRandomProduct)}");
        //        return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
        //    }
        //}

        [HttpGet("getRelatedTag")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetRelatedTag(string category)
        {

            try
            {

                var query = await _unitOfWork.Tags.GetAll(q => q.Product.Category.Name == category,null,null);


                //Select All distinct values in a column using LINQ
                return Accepted(new { result= query.GroupBy(q => q.Name).Select(q => q.First()).Distinct() });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetRandomProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }
    }
}
