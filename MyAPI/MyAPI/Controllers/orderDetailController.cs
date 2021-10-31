using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MyAPI.DTOs;
using MyAPI.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class orderDetailController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<orderDetailController> _logger;

        public orderDetailController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<orderDetailController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }


        [HttpGet("{id:int}", Name = "GetOrderDetail")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetOrderDetail(int id)
        {
            try
            {
                var query = await _unitOfWork.OrderDetails.Get(q => q.Id == id, new List<string> { "Product" });
                var result = _mapper.Map<OrderDetailDTO>(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetOrderDetail)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }
    }
}
