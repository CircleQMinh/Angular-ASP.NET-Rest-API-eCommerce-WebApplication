using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MyAPI.Configurations;
using MyAPI.Data;
using MyAPI.DTOs;
using MyAPI.IRepository;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace MyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class adminController : ControllerBase
    {
        private readonly UserManager<APIUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<adminController> _logger;
        private readonly IMapper _mapper;
        public adminController(UserManager<APIUser> userManager, IUnitOfWork unitOfWork,
          ILogger<adminController> logger,
          IMapper mapper)
        {
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("dashboardInfo",Name = "GetDashboardInfo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDashboardInfo()
        {
            try
            {
                var totalProduct = await _unitOfWork.Products.GetCount(null);
                var totalOrder = await _unitOfWork.Orders.GetCount(q=>q.Status==0);
                var totalUser = await _unitOfWork.Users.GetCount();

                return Ok(new {totalUser,totalProduct,totalOrder  });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetDashboardInfo)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }


        [HttpGet("users", Name = "GetUserForAdmin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUserForAdmin(string role,string order, string orderDir)
        {
            try
            {
                Func<IQueryable<APIUser>, IOrderedQueryable<APIUser>> orderBy = null;
                switch (order)
                {
                    case "Email":
                        if (orderDir == "Desc")
                        {
                            orderBy = a => a.OrderByDescending(x => x.Email);
                        }
                        else
                        {
                            orderBy = a => a.OrderBy(x => x.Email);
                        }
                        break;
                    case "Id":
                        if (orderDir == "Desc")
                        {
                            orderBy = a => a.OrderByDescending(x => x.Id);
                        }
                        else
                        {
                            orderBy = a => a.OrderBy(x => x.Id);
                        }
                        break;
                    case "Name":
                        if (orderDir == "Desc")
                        {
                            orderBy = a => a.OrderByDescending(x => x.DisplayName);
                        }
                        else
                        {
                            orderBy = a => a.OrderBy(x => x.DisplayName);
                        }
                        break;
                }

                var query = await _unitOfWork.Users.GetAll(null,orderBy,null);

               
                var roles = new List<IList<string>>();
            
                if (role!="all")
                {
                    var result = new List<UserInfoDTO>();
                    foreach (var item in query)
                    {
                        var r = await _userManager.GetRolesAsync(item);
                        if (r.Contains(role))
                        {
                            roles.Add(r);
                            var u = _mapper.Map<UserInfoDTO>(item);
                            result.Add(u);
                        }
                    }
                    var count = result.Count;
                    return Ok(new {result,count,roles });
                }
                else
                {
                    var result = _mapper.Map<IList<UserInfoDTO>>(query);
                    foreach (var item in query)
                    {
                        var r = await _userManager.GetRolesAsync(item);
                        roles.Add(r);
                    }
                    var count = result.Count;
                    return Ok(new { result, count, roles });
                }
              
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetUserForAdmin)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }


        [HttpGet("products", Name = "GetProductForAdmin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetProductForAdmin(string category,string order, int pageNumber, int pageSize, string orderDir)
        {
            try
            {
                Func<IQueryable<Product>, IOrderedQueryable<Product>> orderBy = null;
                Expression<Func<Product, bool>> expression = null;
                switch (order)
                {
                    case "Price":
                        if (orderDir == "Desc")
                        {
                            orderBy = a => a.OrderByDescending(x => x.Price);
                        }
                        else
                        {
                            orderBy = a => a.OrderBy(x => x.Price);
                        }
                        break;
                    case "Name":
                        if (orderDir == "Desc")
                        {
                            orderBy = a => a.OrderByDescending(x => x.Name);
                        }
                        else
                        {
                            orderBy = a => a.OrderBy(x => x.Name);
                        }
                        break;
                    case "Id":
                        if (orderDir == "Desc")
                        {
                            orderBy = a => a.OrderByDescending(x => x.Id);
                        }
                        else
                        {
                            orderBy = a => a.OrderBy(x => x.Id);
                        }
                        break;
                }
                if (category != "all")
                {
                    expression = q => q.Category == category;
                }
                PaginationFilter pf = new PaginationFilter(pageNumber, pageSize);
                var query = await _unitOfWork.Products.GetAll(expression, orderBy, null, pf);
                var result = _mapper.Map<IList<ProductDTO>>(query);
                var count = await _unitOfWork.Products.GetCount(expression);
                return Ok(new { result,count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetProductForAdmin)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }



        [HttpGet("orders", Name = "GetOrderForAdmin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetOrderForAdmin(int status, string order, int pageNumber, int pageSize,string orderDir)
        {
            try
            {
                Func<IQueryable<Order>, IOrderedQueryable<Order>> orderBy = null;
                Expression<Func<Order, bool>> expression = null;
                int flag = 0;
                switch (order)
                {
                    case "Price":
                        if (orderDir=="Desc")
                        {
                            orderBy = a => a.OrderByDescending(x => x.TotalPrice);
                        }
                        else
                        {
                            orderBy = a => a.OrderBy(x => x.TotalPrice);
                        }
                       
                        break;
                    case "OrderDate":
                        flag = 1;
                        break;
                    case "Id":
                        if (orderDir == "Desc")
                        {
                            orderBy = a => a.OrderByDescending(x => x.Id);
                        }
                        else
                        {
                            orderBy = a => a.OrderBy(x => x.Id);
                        }
                        break;
                }
                if (status != 99)
                {
                    expression = q => q.Status == status;
                }
                if (flag==1)
                {

                    var query = await _unitOfWork.Orders.GetAll(expression, orderBy, null);
                    var result = _mapper.Map<IList<OrderDTO>>(query);
                    var orderedList = result.OrderBy(x => DateTime.Parse(x.OrderDate)).ToList();
                    List<OrderDTO> list = new List<OrderDTO>();
                    if (orderDir == "Desc")
                    {
                        orderedList.Reverse();
                    }
                    for (int i=0;i<pageSize;i++)
                    {
                        if ((i + pageSize * (pageNumber - 1))<orderedList.Count)
                        {
                            list.Add(orderedList[i + pageSize * (pageNumber - 1)]);
                        }
                    }
                 
                    return Ok(new { result=list, count=orderedList.Count });
                }
                else
                {
                
                    PaginationFilter pf = new PaginationFilter(pageNumber, pageSize);
                    var query = await _unitOfWork.Orders.GetAll(expression, orderBy, null, pf);
                    var result = _mapper.Map<IList<OrderDTO>>(query);
                    var count = await _unitOfWork.Orders.GetCount(expression);
                    return Ok(new { result, count });
                }
             
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetOrderForAdmin)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }


        [HttpPost("createUser")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateUser([FromBody] UserDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(CreateUser)}");
                return BadRequest(ModelState);
            }
            var existingUser = await _userManager.FindByEmailAsync(unitDTO.Email);
            if (existingUser != null)
            {
                var error = "Submitted data is invalid";
                return BadRequest(new { error });
            }
            try
            {
                var user = _mapper.Map<APIUser>(unitDTO);
                user.UserName = unitDTO.Email;
                user.EmailConfirmed = true;
                var result = await _userManager.CreateAsync(user, unitDTO.Password);


                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(error.Code, error.Description);
                    }
                    return BadRequest(ModelState);
                }
                await _userManager.AddToRolesAsync(user, unitDTO.Roles);



                return Accepted(new {unitDTO  });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(CreateUser)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }


        [HttpDelete("deleteUser", Name = "DeleteUser")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var existingUser = await _userManager.FindByIdAsync(id);
            if (existingUser == null)
            {
                var error = "Submitted data is invalid";
                return BadRequest(new { error });
            }

            try
            {
                await _userManager.DeleteAsync(existingUser);

                var success = true;

                return Accepted(new { success });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(DeleteUser)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }
    }
}
