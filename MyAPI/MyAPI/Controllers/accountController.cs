using MyAPI.Configurations;
using MyAPI.Data;
using MyAPI.DTOs;

using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc.Routing;
using MyAPI.IRepository;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;

namespace MyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class accountController : ControllerBase
    {
        private readonly UserManager<APIUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<accountController> _logger;
        private readonly IMapper _mapper;
        private readonly IAuthManager _authManager;

        public accountController(UserManager<APIUser> userManager, IUnitOfWork unitOfWork,
            ILogger<accountController> logger,
            IMapper mapper,
            IAuthManager authManager)
        {
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _authManager = authManager;
        }

        [HttpPost]
        [Route("register")]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] UserDTO userDTO)
        {
            _logger.LogInformation($"Registration Attempt for {userDTO.Email} ");
            var existingUser = await _userManager.FindByEmailAsync(userDTO.Email);

            if (existingUser != null)
            {
                var error = "Email đã được sử dụng!";
                return BadRequest(new { msg=error });
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = _mapper.Map<APIUser>(userDTO);
                user.UserName = userDTO.Email;
                var result = await _userManager.CreateAsync(user, userDTO.Password);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(error.Code, error.Description);
                    }
                    return BadRequest(ModelState);
                }
                await _userManager.AddToRolesAsync(user, userDTO.Roles);



                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                
                EmailHelper emailHelper = new EmailHelper();
                string emailResponse = emailHelper.SendEmailConfirm(user.Email, token,userDTO.DisplayName);


                return Accepted(new { success= emailResponse });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(Register)}");
                return Problem($"Something Went Wrong in the {nameof(Register)}" + "\n" + ex.ToString(), statusCode: 500);
            }
        }

      

        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody]ConfirmEmailDTO ce)
        {
            var user = await _userManager.FindByEmailAsync(ce.email);
            if (user==null)
            {
                var error = "Submitted token is invalid";
                return BadRequest(new { error });
            }
            var result = await _userManager.ConfirmEmailAsync(user, ce.token);

            if (result.Succeeded)
            {
                return Accepted(new { result });
            }
            else
            {
                return BadRequest(new { result });

            }
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            APIUser user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                var error = "Không tìm thấy tài khoản với email!";
                return BadRequest(new { msg = error });
            }
            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                var error = "Tài khoản chưa xác thực!";
                return BadRequest(new { msg = error });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            EmailHelper emailHelper = new EmailHelper();
            string emailResponse = emailHelper.SendEmailResetPassword(user.Email, token,user.DisplayName);

            return Accepted(new { success = emailResponse });
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO unitDTO)
        {
            APIUser user = await _userManager.FindByEmailAsync(unitDTO.Email);
            if (user == null)
            {
                var error = "Submitted values is invalid";
                return BadRequest(new { error });
            }
            var result = await _userManager.ResetPasswordAsync(user, unitDTO.Token,unitDTO.Password);
            if (result.Succeeded)
            {
                return Accepted(new { result });
            }
            else
            {
                return BadRequest(new { result });

            }

         
        }


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDTO userDTO)
        {
            _logger.LogInformation($"Login Attempt for {userDTO.Email} ");
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (!await _authManager.ValidateUser(userDTO))
                {
                    var error = "Thông tin đăng nhập không chính xác! Xin hãy thử lại.";
                    return BadRequest(new { msg = error });
                }
                APIUser u = await _userManager.FindByEmailAsync(userDTO.Email);
                if (!u.EmailConfirmed)
                {
                    var error = "Bạn chưa xác thục tài khoản!";
                    return BadRequest(new { msg = error });
                }
                var roles = await _userManager.GetRolesAsync(u);
                var results = _mapper.Map<UserInfoDTO>(u);
                return Accepted(new { Token = await _authManager.CreateToken(), user=results,roles });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(Login)}");
                return Problem($"Something Went Wrong in the {nameof(Login)}" +"/n"+ex.ToString(), statusCode: 500);
            }
        }


    
        [HttpGet( Name = "GetUserInfo")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUserInfo(string id)
        {
            var requestId = User.Identity.Name;
            var requestUser = await _userManager.FindByNameAsync(requestId);
            try
            {
                APIUser u = await _userManager.FindByIdAsync(id);
                if (u.Id != requestUser.Id)
                {
                    var error = "ID không hợp lệ! Bad hacker :)";
                    return BadRequest(new { msg = error });
                }
                var roles = await _userManager.GetRolesAsync(u);
                var user = _unitOfWork.Users.Get(q=>q.Id==id, new List<string> { "Orders", "FavoriteProducts" });
                var rs = _mapper.Map<UserOrderInfoDTO>(user.Result);
                return Ok(new {roles,user=rs });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetUserInfo)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later."+ex.ToString());
            }
        }


        [HttpPut( Name = "UpdateUserInfo")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateUserInfo(string id, [FromBody] UpdateUserInfoDTO unitDTO)
        {
            if (!ModelState.IsValid || id.Length==0)
            {
                _logger.LogError($"Invalid UPDATE attempt in {nameof(UpdateUserInfo)}");
                return BadRequest(ModelState);
            }

            try
            {
                APIUser u = await _userManager.FindByIdAsync(id);
                u.DisplayName = unitDTO.Username;
                u.PhoneNumber = unitDTO.Phone;
                u.imgUrl = unitDTO.ImgUrl;

                var result = await _userManager.UpdateAsync(u);
                if (result.Succeeded)
                {
                    return Accepted(new { user=u});
                }
                return BadRequest("Submitted data is invalid");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(UpdateUserInfo)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }


        [HttpPost("addFavoriteProduct",Name = "AddUserFavoriteProduct")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AddUserFavoriteProduct([FromBody] AddUserFavoriteProductDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Submitted data is invalid");
            }
            var requestId = User.Identity.Name;

            try
            {
                APIUser u = await _unitOfWork.Users.Get(q => q.Id == unitDTO.UserId, new List<string> { "FavoriteProducts" });
                if (u.Email != requestId)
                {
                    var error = "ID không hợp lệ! Bad hacker :)";
                    return BadRequest(new { msg = error });
                }
                Product pro = await _unitOfWork.Products.Get(q => q.Id == unitDTO.ProductId, new List<string> { "FavoritedUsers" });

                foreach (var item in u.FavoriteProducts)
                {
                    if (item.Id==pro.Id)
                    {
                        return Ok(new { success = false });
                    }
                }


                var User = u;
                _unitOfWork.Users.Update(User);
                var Product = pro;
                _unitOfWork.Products.Update(Product);
                User.FavoriteProducts.Add(Product);
                Product.FavoritedUsers.Add(User);

                await _unitOfWork.Save();
                return Ok(new { success = true });

               


                //u = await _unitOfWork.Users.Get(q => q.Id == unitDTO.UserId, new List<string> { "FavoriteProducts" });
                //pro = await _unitOfWork.Products.Get(q => q.Id == unitDTO.ProductId, new List<string> { "FavoritedUsers" });
                //return Ok(new { success = true,u,pro });
               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(AddUserFavoriteProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }


        [HttpPost("removeFavoriteProduct", Name = "RemoveFavoriteProduct")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RemoveFavoriteProduct([FromBody] AddUserFavoriteProductDTO unitDTO)
        {
            var requestId = User.Identity.Name;

            if (!ModelState.IsValid)
            {
                return BadRequest("Submitted data is invalid");
            }
            try
            {
                APIUser u = await _unitOfWork.Users.Get(q => q.Id == unitDTO.UserId, new List<string> { "FavoriteProducts" });
                if (u.Email != requestId)
                {
                    var error = "ID không hợp lệ! Bad hacker :)";
                    return BadRequest(new { msg = error });
                }
                Product pro = await _unitOfWork.Products.Get(q => q.Id == unitDTO.ProductId, new List<string> { "FavoritedUsers" });

                bool isItemInFav = false;
                foreach (var item in u.FavoriteProducts)
                {
                    if (item.Id == pro.Id)
                    {
                        isItemInFav = true;
                        break;
                    }
                }

                if (!isItemInFav)
                {
                    return Ok(new { success = false });
                }
                _unitOfWork.Users.Update(u);

 
                //_unitOfWork.Products.Update(pro);

                foreach (var item in u.FavoriteProducts)
                {
                    if (item.Id==pro.Id)
                    {
                        u.FavoriteProducts.Remove(item);
                    }
                }
                foreach (var item in pro.FavoritedUsers)
                {
                    if (item.Id==u.Id)
                    {
                        pro.FavoritedUsers.Remove(item);
                    }
                }
           

                await _unitOfWork.Save();
                return Ok(new { success = true });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(RemoveFavoriteProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }

        [HttpPost("exchangeDiscountCode", Name = "exchangeDiscountCode")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExchangeDiscountCode([FromBody] GetDiscountCodeDTO unitDTO)
        {
            var requestId = User.Identity.Name;

            if (!ModelState.IsValid)
            {
                return BadRequest("Submitted data is invalid");
            }
            try
            {
                APIUser u = await _unitOfWork.Users.Get(q => q.Id == unitDTO.UserId);

                if (u==null)
                {
                    return BadRequest("User không tồn tại!");
                }
                DiscountCode dc = new DiscountCode();

                DateTime today = DateTime.Today;
                DateTime endDay = today.AddDays(30);
                String s_today = today.ToString("yyyy-MM-dd");
                String s_endDay = endDay.ToString("yyyy-MM-dd");
                Util util = new Util();
           
                switch (unitDTO.Mode)
                {
                    case 1://20k 20
                        if (u.Coins>=20)
                        {
                            u.Coins -= 20;
                            dc.Code = util.RandomString(12);
                            dc.Status = 0;
                            dc.StartDate = s_today;
                            dc.EndDate = s_endDay;
                            dc.DiscountAmount = "20000";
                            dc.DiscountPercent = "null";
                        }
                        else
                        {
                            return Accepted(new { success=false,msg = "Không đủ shop xu để đổi mã giảm giá!" });
                        }
                        break;
                    case 2://50k 50
                        if (u.Coins >= 50)
                        {
                            u.Coins -= 50;
                            dc.Code = util.RandomString(12);
                            dc.Status = 0;
                            dc.StartDate = s_today;
                            dc.EndDate = s_endDay;
                            dc.DiscountAmount = "50000";
                            dc.DiscountPercent = "null";
                        }
                        else
                        {
                            return Accepted(new { success = false, msg = "Không đủ shop xu để đổi mã giảm giá!" });
                        }
                        break;
                    case 3://100k 100
                        if (u.Coins >= 100)
                        {
                            u.Coins -= 100;
                            dc.Code = util.RandomString(12);
                            dc.Status = 0;
                            dc.StartDate = s_today;
                            dc.EndDate = s_endDay;
                            dc.DiscountAmount = "100000";
                            dc.DiscountPercent = "null";
                        }
                        else
                        {
                            return Accepted(new { success = false, msg = "Không đủ shop xu để đổi mã giảm giá!" });
                        }
                        break;
                    case 4://10% 20
                        if (u.Coins >= 20)
                        {
                            u.Coins -= 20;
                            dc.Code = util.RandomString(12);
                            dc.Status = 0;
                            dc.StartDate = s_today;
                            dc.EndDate = s_endDay;
                            dc.DiscountPercent = "10";
                            dc.DiscountAmount = "null";
                        }
                        else
                        {
                            return Accepted(new { success = false, msg = "Không đủ shop xu để đổi mã giảm giá!" });
                        }
                        break;
                    case 5://30% 50
                        if (u.Coins >= 50)
                        {
                            u.Coins -= 100;
                            dc.Code = util.RandomString(12);
                            dc.Status = 0;
                            dc.StartDate = s_today;
                            dc.EndDate = s_endDay;
                            dc.DiscountPercent = "30";
                            dc.DiscountAmount = "null";
                        }
                        else
                        {
                            return Accepted(new { success = false, msg = "Không đủ shop xu để đổi mã giảm giá!" });
                        }
                        break;
                    case 6://50% 120
                        if (u.Coins >= 120)
                        {
                            u.Coins -= 120;
                            dc.Code = util.RandomString(12);
                            dc.Status = 0;
                            dc.StartDate = s_today;
                            dc.EndDate = s_endDay;
                            dc.DiscountPercent = "50";
                            dc.DiscountAmount = "null";
                        }
                        else
                        {
                            return Accepted(new { success = false, msg = "Không đủ shop xu để đổi mã giảm giá!" });
                        }
                        break;
                    default:
                        return BadRequest("Không hợp lệ!");
                }
                _unitOfWork.Users.Update(u);
                await _unitOfWork.DiscountCodes.Insert(dc);
                await _unitOfWork.Save();

                EmailHelper email = new EmailHelper();
                var emailSend = email.SendEmailWithDiscountCode(u.DisplayName, u.Email, dc);

                return Accepted(new { success = true,msg="Đã đổi mã giảm giá thành công",discountCode=dc,emailSend });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(RemoveFavoriteProduct)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }

    }
}
