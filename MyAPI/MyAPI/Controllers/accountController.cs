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
                var error = "Submitted data is invalid";
                return BadRequest(new { error });
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
                string emailResponse = emailHelper.SendEmailConfirm(user.Email, token);


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
            if (user == null|!(await _userManager.IsEmailConfirmedAsync(user)))
            {
                var error = "Submitted values is invalid";
                return BadRequest(new { error });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            EmailHelper emailHelper = new EmailHelper();
            string emailResponse = emailHelper.SendEmailResetPassword(user.Email, token);

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
                    return Unauthorized();
                }
                APIUser u = await _userManager.FindByEmailAsync(userDTO.Email);
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUserInfo(string id)
        {
            try
            {
                APIUser u = await _userManager.FindByIdAsync(id);
                var roles = await _userManager.GetRolesAsync(u);
                var user = _unitOfWork.Users.Get(q=>q.Id==id, new List<string> { "Orders"});
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
    }
}
