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

namespace MyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class accountController : ControllerBase
    {
        private readonly UserManager<APIUser> _userManager;
        private readonly ILogger<accountController> _logger;
        private readonly IMapper _mapper;
        private readonly IAuthManager _authManager;

        public accountController(UserManager<APIUser> userManager,
            ILogger<accountController> logger,
            IMapper mapper,
            IAuthManager authManager)
        {
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
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

        //[HttpPost]
        //[Route("info")]
        //public async Task<IActionResult> Info([FromBody] LoginUserDTO userDTO)
        //{
        //    _logger.LogInformation($"Login Attempt for {userDTO.Email} ");
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    try
        //    {
        //        if (!await _authManager.ValidateUser(userDTO))
        //        {
        //            return Unauthorized();
        //        }

        //        return Accepted(new { Token = await _authManager.CreateToken(), userDTO });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, $"Something Went Wrong in the {nameof(Login)}");
        //        return Problem($"Something Went Wrong in the {nameof(Login)}", statusCode: 500);
        //    }
        //}
    }
}
