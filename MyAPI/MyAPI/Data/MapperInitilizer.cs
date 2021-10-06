using AutoMapper;
using MyAPI.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Data
{
    public class MapperInitilizer : Profile
    {
        public MapperInitilizer()
        {
            CreateMap<Product, ProductDTO>().ReverseMap();
            CreateMap<Product, FullProductDTO>().ReverseMap();
            CreateMap<Product, CreateProductDTO>().ReverseMap();

            CreateMap<APIUser, UserDTO>().ReverseMap();
            CreateMap<APIUser, UserInfoDTO>().ReverseMap();
            CreateMap<APIUser, UserOrderInfoDTO>().ReverseMap();
            CreateMap<APIUser, ReviewUserInfoDTO>().ReverseMap();

            CreateMap<Order, OrderDTO>().ReverseMap();
            CreateMap<Order, CreateOrderDTO>().ReverseMap();
            CreateMap<Order, UpdateOrderDTO>().ReverseMap();
            CreateMap<Order, FullOrderDTO>().ReverseMap();

            CreateMap<OrderDetail, OrderDetailDTO>().ReverseMap();
            CreateMap<OrderDetail, TKOrderDetailDTO>().ReverseMap();
            CreateMap<OrderDetail, FullOrderDetailDTO>().ReverseMap();
            CreateMap<OrderDetail, CreateOrderDetailDTO>().ReverseMap();

            CreateMap<ShippingInfo, ShippingInfoDTO>().ReverseMap();
            CreateMap<ShippingInfo, ShortShippingInfo>().ReverseMap();


            CreateMap<Review, ReviewDTO>().ReverseMap();
            CreateMap<Review, CreateReviewDTO>().ReverseMap();

            CreateMap<EmployeeInfo, EmployeeDTO>().ReverseMap();

            CreateMap<Promotion, CreatePromotionDTO>().ReverseMap();
            CreateMap<Promotion, PromotionDTO>().ReverseMap();

            CreateMap<PromotionInfo, CreatePromotionInfoDTO>().ReverseMap();
            CreateMap<PromotionInfo, PromotionInfoDTO>().ReverseMap();
        }
    }
}
