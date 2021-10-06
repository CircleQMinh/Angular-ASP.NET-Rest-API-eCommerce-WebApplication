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


        [HttpGet("employees", Name = "GetEmployeeForAdmin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetEmployeeForAdmin(string role, string order, string orderDir)
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

                var query = await _unitOfWork.Users.GetAll(null, orderBy, null);


                var roles = new List<IList<string>>();

                if (role != "all")
                {
                    var result = new List<UserInfoDTO>();
                    var employeeInfo = new List<EmployeeDTO>();
                    foreach (var item in query)
                    {
                        var r = await _userManager.GetRolesAsync(item);
                        if (r.Contains(role))
                        {
                            roles.Add(r);
                            var u = _mapper.Map<UserInfoDTO>(item);
                            result.Add(u);
                            var i = await _unitOfWork.EmployeeInfos.Get(q => q.EmployeeID == u.Id);
                            var info = _mapper.Map<EmployeeDTO>(i);
                            employeeInfo.Add(info);
                        }
                    }
                    var count = result.Count;

                    return Ok(new { result, count, roles,employeeInfo });
                }
                else
                {
                    var result = new List<UserInfoDTO>();
                    var employeeInfo = new List<EmployeeDTO>();
                    foreach (var item in query)
                    {
                        var r = await _userManager.GetRolesAsync(item);
                        if (r.Contains("Shipper")||r.Contains("Employee"))
                        {
                            roles.Add(r);
                            var u = _mapper.Map<UserInfoDTO>(item);
                            result.Add(u);
                            var i = await _unitOfWork.EmployeeInfos.Get(q => q.EmployeeID == u.Id);
                            var info = _mapper.Map<EmployeeDTO>(i);
                            employeeInfo.Add(info);
                        }
                      
                    }
                    var count = result.Count;
                    return Ok(new { result, count, roles,employeeInfo });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetEmployeeForAdmin)}");
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
                    List<ShortShippingInfo> shippingInfos = new List<ShortShippingInfo>();
                    foreach (var item in orderedList)
                    {
                        var si = await _unitOfWork.ShippingInfos.Get(q => q.OrderId == item.Id, new List<string> { "Shipper" });
                        var si_map = _mapper.Map<ShortShippingInfo>(si);
                        shippingInfos.Add(si_map);
                    }
                    return Ok(new { result=list, count=orderedList.Count, shippingInfos });
                }
                else
                {
                
                    PaginationFilter pf = new PaginationFilter(pageNumber, pageSize);
                    var query = await _unitOfWork.Orders.GetAll(expression, orderBy, null, pf);
                    var result = _mapper.Map<IList<OrderDTO>>(query);
                    List<ShortShippingInfo> shippingInfos = new List<ShortShippingInfo>();
                    foreach (var item in result)
                    {
                        var si = await _unitOfWork.ShippingInfos.Get(q => q.OrderId == item.Id,new List<string> {"Shipper" });
                        var si_map = _mapper.Map<ShortShippingInfo>(si);
                        shippingInfos.Add(si_map);
                    }
                    var count = await _unitOfWork.Orders.GetCount(expression);
                    return Ok(new { result, count, shippingInfos });
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
                var error = "Email đã được sử dụng";
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
                var error = "Không tìm thấy người dùng! Xin hãy thử lại";
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
                return StatusCode(500, "Internal Server Error. Please Try Again Later."+ex.ToString());
            }
        }


        [HttpPost("createEmployee")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(CreateEmployee)}");
                return BadRequest(ModelState);
            }
            var existingUser = await _userManager.FindByEmailAsync(unitDTO.Email);
            if (existingUser != null)
            {
                var error = "Email đã được sử dụng!";
                return BadRequest(new { error });
            }
            try
            {
                var user = new APIUser();
                user.DisplayName = unitDTO.DisplayName;
                user.imgUrl = unitDTO.imgUrl;
                user.Email = unitDTO.Email;
                user.PhoneNumber = unitDTO.PhoneNumber;
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

                var employeeInfo = new EmployeeInfo();
                employeeInfo.EmployeeID = user.Id;
                employeeInfo.Salary = unitDTO.Salary;
                employeeInfo.Sex = unitDTO.Sex;
                employeeInfo.StartDate = unitDTO.StartDate;
                employeeInfo.Status = unitDTO.Status;
                employeeInfo.Address = unitDTO.Address;
                employeeInfo.CMND = unitDTO.CMND;

                await _unitOfWork.EmployeeInfos.Insert(employeeInfo);
                await _unitOfWork.Save();


                return Accepted(new { employee=user,employeeInfo });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(CreateUser)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }


        [HttpPut("editEmployee")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditEmployee(string id,[FromBody] EditEmployeeDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid PUT attempt in {nameof(EditEmployee)}");
                return BadRequest(ModelState);
            }
            var emp = await _userManager.FindByIdAsync(id);
            if (emp == null)
            {
                var error = "Không tìm thấy người dùng!";
                return BadRequest(new { error });
            }
            try
            {
                var empInfo = await _unitOfWork.EmployeeInfos.Get(q => q.EmployeeID == id);
                var role = await _userManager.GetRolesAsync(emp);
                await _userManager.RemoveFromRolesAsync(emp, role);

                emp.imgUrl = unitDTO.imgUrl;
                emp.PhoneNumber = unitDTO.PhoneNumber;
                emp.DisplayName = unitDTO.DisplayName;
                await _userManager.AddToRoleAsync(emp, unitDTO.Roles[0]);
                _unitOfWork.Users.Update(emp);

                empInfo.Address = unitDTO.Address;
                empInfo.CMND = unitDTO.CMND;
                empInfo.Salary = unitDTO.Salary;
                empInfo.Sex = unitDTO.Sex;
                empInfo.StartDate = unitDTO.StartDate;
                empInfo.Status = unitDTO.Status;
                _unitOfWork.EmployeeInfos.Update(empInfo);
                await _unitOfWork.Save();

                return Accepted(new {success=true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(EditEmployee)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }
        [HttpDelete("deleteEmployee", Name = "DeleteEmployee")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteEmployee(string id)
        {
            var existingUser = await _userManager.FindByIdAsync(id);
            if (existingUser == null)
            {
                var error = "Submitted data is invalid";
                return BadRequest(new { error });
            }

            try
            {
                var empInfo = await _unitOfWork.EmployeeInfos.Get(q => q.EmployeeID == id);
                await _unitOfWork.EmployeeInfos.Delete(empInfo.Id);
                await _unitOfWork.Save();
                await _userManager.DeleteAsync(existingUser);

                var success = true;

                return Accepted(new { success });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(DeleteEmployee)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }

        [HttpGet("getSalesChart", Name = "GetSalesChart")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSalesChart(string from,string to)
        {
            try
            {
                DateTime dfrom = DateTime.ParseExact(from, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                DateTime dto = DateTime.ParseExact(to, "yyyy-MM-dd", CultureInfo.InvariantCulture);


                var si = await _unitOfWork.ShippingInfos.GetAll(q => q.Order.Status==3,null ,new List<string> { "Shipper","Order" });
                var si_map = _mapper.Map< IList<ShippingInfoDTO>>(si);

                var list = new List<Dictionary<string, string>>();
                var result = new List<Dictionary<string, string>>();
                foreach (var item in si_map)
                {
                    item.deliveryDate = item.deliveryDate.Substring(0, 10);
                    DateTime dt = DateTime.ParseExact(item.deliveryDate, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                    if (dt>=dfrom&&dt<=dto)
                    {
                        var dic = new Dictionary<string, string>();
                        dic.Add("Date", item.deliveryDate);
                        dic.Add("Total", item.Order.TotalPrice.ToString());
                        dic.Add("NumberOfOrder", 1.ToString());
                        list.Add(dic);
                    }
                }
                for (int i=0;i<list.Count;i++)
                {
                    var exist = false;
                    for(int j = 0; j < result.Count; j++)
                    {
                        if (list[i]["Date"]==result[j]["Date"])
                        {
                            exist = true;
                            break;
                        }
                    }
                    if (exist)
                    {
                        for (int j=0;j<result.Count;j++)
                        {
                            if (list[i]["Date"] == result[j]["Date"])
                            {
                                result[j]["Total"] = (Double.Parse(result[j]["Total"]) + Double.Parse(list[i]["Total"])).ToString();
                                result[j]["NumberOfOrder"] = (Double.Parse(result[j]["NumberOfOrder"]) + Double.Parse(list[i]["NumberOfOrder"])).ToString();
                                break;
                            }
                        }
                    }
                    else
                    {
                        result.Add(list[i]);
                    }
                }
                return Accepted(new { result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetSalesChart)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }


        [HttpGet("getProductChart", Name = "GetProductChart")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetProductChart()
        {
            try
            {
                var result = new List<Dictionary<string, string>>();
                List<string> cate = new List<string> {"Fruit","Vegetable","Confectionery","Snack","AnimalProduct","CannedFood" };
                List<string> cateVN = new List<string> { "Trái cây", "Rau củ", "Bánh kẹo", "Snack", "Thịt tươi sống", "Đồ hộp" };

                for (int i=0;i<cate.Count;i++)
                {
                    var count = await _unitOfWork.Products.GetCount(q => q.Category == cate[i]);
                    var dic = new Dictionary<string, string>();
                    dic.Add("name", cateVN[i]);
                    dic.Add("value", count.ToString());
                    result.Add(dic);
                }

                return Accepted(new { result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetProductChart)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }


        [HttpGet("getTopProductChart", Name = "GetTopProductChart")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTopProductChart(int top)
        {
            try
            {
                List<string> cate = new List<string> { "Fruit", "Vegetable", "Confectionery", "Snack", "AnimalProduct", "CannedFood" };
                List<string> cateVN = new List<string> { "Trái cây", "Rau củ", "Bánh kẹo", "Snack", "Thịt tươi sống", "Đồ hộp" };
                var pro = await _unitOfWork.OrderDetails.GetAll(q => q.Order.Status == 3, null, new List<string> { "Product"});
                var pro_map = _mapper.Map<IList<TKOrderDetailDTO>>(pro);

                var result = new List<TKOrderDetailDTO>();
                var listCate = new List<Dictionary<string, string>>();
                for (int i=0;i<cate.Count;i++)
                {
                    var dic = new Dictionary<string, string>();
                    dic.Add("name", cate[i]);
                    dic.Add("value", 0.ToString());
                    listCate.Add(dic);
                }

                foreach (var item in pro_map)
                {
                    var exist = false;

                    for (int i=0;i<result.Count;i++)
                    {
                        if (result[i].ProductId==item.ProductId)
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

                    for (int i=0;i<listCate.Count;i++)
                    {
                        if (item.Product.Category==listCate[i]["name"])
                        {
                            listCate[i]["value"] = (int.Parse(listCate[i]["value"])+item.Quantity).ToString();
                        }
                    }

                }
                for (int i=0;i<listCate.Count;i++)
                {
                    listCate[i]["name"] = cateVN[i];
                }
                result.Sort((a,b) => b.Quantity-a.Quantity);
                var maxCount = result.Max(q => q.Quantity);
                return Accepted(new { result=result.Take(top),cateCount=listCate,maxCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetTopProductChart)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }


        [HttpGet("promotion", Name = "getPromotions")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPromotions(int status, string order, int pageNumber, int pageSize, string orderDir)
        {
            Func<IQueryable<Promotion>, IOrderedQueryable<Promotion>> orderBy = null;
            Expression<Func<Promotion, bool>> expression = null;
            try
            {
                if (status!=99)
                {
                    expression = q => q.Status == status;
                }

                IList<PromotionDTO> result;
                var orderedList = new List<PromotionDTO>();
                var pagedList = new List<PromotionDTO>();

                switch (order)
                {
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
                            orderBy = a => a.OrderByDescending(x => x.Name);
                        }
                        else
                        {
                            orderBy = a => a.OrderBy(x => x.Name);
                        }
                        break;
                    case "StartDate":
                        var query = await _unitOfWork.Promotions.GetAll(expression, orderBy, null);
                        result = _mapper.Map<IList<PromotionDTO>>(query);
                        orderedList = result.OrderBy(x => DateTime.Parse(x.StartDate)).ToList();
                        if (orderDir == "Desc")
                        {
                            orderedList.Reverse();
                        }
                        for (int i = 0; i < pageSize; i++)
                        {
                            if ((i + pageSize * (pageNumber - 1)) < orderedList.Count)
                            {
                                pagedList.Add(orderedList[i + pageSize * (pageNumber - 1)]);
                            }
                        }
                        return Accepted(new { pagedList });
                    case "EndDate":
                        var query2 = await _unitOfWork.Promotions.GetAll(expression, orderBy, null);
                        result = _mapper.Map<IList<PromotionDTO>>(query2);
                        orderedList = result.OrderBy(x => DateTime.Parse(x.EndDate)).ToList();
                        if (orderDir == "Desc")
                        {
                            orderedList.Reverse();
                        }
                        for (int i = 0; i < pageSize; i++)
                        {
                            if ((i + pageSize * (pageNumber - 1)) < orderedList.Count)
                            {
                                pagedList.Add(orderedList[i + pageSize * (pageNumber - 1)]);
                            }
                        }
                        return Accepted(new { result=pagedList, count = orderedList.Count });
                }

                var query3 = await _unitOfWork.Promotions.GetAll(expression, orderBy, null, new PaginationFilter(pageNumber, pageSize));
                result = _mapper.Map<IList<PromotionDTO>>(query3);
                var count = await _unitOfWork.Promotions.GetCount(expression);

                return Accepted(new { result,count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetPromotions)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }

        [HttpPost("createPromotion", Name = "createPromotion")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreatePromotion([FromBody] CreatePromotionDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(CreatePromotion)}");
                return BadRequest(ModelState);
            }

            try
            {
                var query = _mapper.Map<Promotion>(unitDTO);
                await _unitOfWork.Promotions.Insert(query);
                await _unitOfWork.Save();

                return Accepted(new { query });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(CreatePromotion)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later."+ex.ToString());
            }
        }


        [HttpPut("editPromotion/{id:int}", Name = "editPromotion")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditPromotion(int id,[FromBody] CreatePromotionDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(EditPromotion)}");
                return BadRequest(ModelState);
            }

            try
            {
                var promo = await _unitOfWork.Promotions.Get(q => q.Id == id);
                if (promo == null)
                {
                    _logger.LogError($"Invalid UPDATE attempt in {nameof(EditPromotion)}");
                    return BadRequest("Submitted data is invalid");
                }
                _mapper.Map(unitDTO, promo);
                _unitOfWork.Promotions.Update(promo);
                await _unitOfWork.Save();
                return Accepted(new { success=true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(CreatePromotion)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }

        [HttpDelete("deletePromotion", Name = "deletePromotion")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeletePromotion(int id)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(DeletePromotion)}");
                return BadRequest(ModelState);
            }

            try
            {
                await _unitOfWork.Promotions.Delete(id);
                await _unitOfWork.Save();

                return Accepted(new { success=true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(DeletePromotion)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }

        [HttpPost("createPromotionInfo", Name = "createPromotionInfo")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreatePromotionInfo([FromBody] CreatePromotionInfoDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(CreatePromotionInfo)}");
                return BadRequest(ModelState);
            }

            try
            {
                var query = _mapper.Map<PromotionInfo>(unitDTO);
                await _unitOfWork.PromotionInfos.Insert(query);
                await _unitOfWork.Save();

                return Accepted(new { query });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(CreatePromotionInfo)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }


        [HttpPut("editPromotionInfo/{id:int}", Name = "editPromotionInfo")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditPromotionInfo(int id,[FromBody] CreatePromotionInfoDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(EditPromotionInfo)}");
                return BadRequest(ModelState);
            }

            try
            {
                var promoInfo = await _unitOfWork.PromotionInfos.Get(q => q.Id == id);

                if (promoInfo == null)
                {
                    _logger.LogError($"Invalid UPDATE attempt in {nameof(EditPromotionInfo)}");
                    return BadRequest("Submitted data is invalid");
                }

                _mapper.Map(unitDTO, promoInfo);
                _unitOfWork.PromotionInfos.Update(promoInfo);
                await _unitOfWork.Save();


                return Accepted(new { success=true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(EditPromotionInfo)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }

        [HttpDelete("deletePromotionInfo", Name = "deletePromotionInfo")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeletePromotionInfo(int id)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(DeletePromotionInfo)}");
                return BadRequest(ModelState);
            }

            try
            {
                var promoInfo = await _unitOfWork.PromotionInfos.Get(q => q.ProductId == id);
                await _unitOfWork.PromotionInfos.Delete(promoInfo.Id);
                await _unitOfWork.Save();
                return Accepted(new {success=true  });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(DeletePromotionInfo)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }
    }

}
