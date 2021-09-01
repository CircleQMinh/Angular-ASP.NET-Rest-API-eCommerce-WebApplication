using MyAPI.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class LoginUserDTO
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [StringLength(15, ErrorMessage = "Your Password is limited to {2} to {1} characters", MinimumLength = 6)]
        public string Password { get; set; }
    }

    public class UserDTO : LoginUserDTO
    {
        public string DisplayName { get; set; }
        public string imgUrl { get; set; }

        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; }
        [Required]
        public ICollection<string> Roles { get; set; }

    }

    public class UserInfoDTO 
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string imgUrl { get; set; }

        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; }
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

    }
    public class UserOrderInfoDTO
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string imgUrl { get; set; }

        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; }
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        public virtual ICollection<OrderDTO> Orders { get; set; }
        public virtual ICollection<ProductDTO> FavoriteProducts { get; set; }
    }
    public class ResetPasswordDTO
    {
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
    }

    public class ConfirmEmailDTO
    {
        public string email { get; set; }
        public string token { get; set; }
    }

    public class UpdateUserInfoDTO
    {
        public string Username { get; set; }
        public string ImgUrl { get; set; }

        public string Phone { get; set; }
    }

    public class ReviewUserInfoDTO
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string ImgUrl { get; set; }

    }

    public class AddUserFavoriteProductDTO
    {
        public int ProductId { get; set; }
        public string UserId { get; set; }
    }
}
