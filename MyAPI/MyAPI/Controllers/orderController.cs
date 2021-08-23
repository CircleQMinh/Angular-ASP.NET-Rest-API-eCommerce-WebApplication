using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MyAPI.Data;
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
    public class orderController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<orderController> _logger;
        public orderController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<orderController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

       // [Authorize]
        [HttpGet(Name = "GetOrders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetOrders()
        {

            try
            {
                var query = await _unitOfWork.Orders.GetAll(null, null, new List<string> { "User","OrderDetails" });
                var results = _mapper.Map<IList<OrderDTO>>(query);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetOrders)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }


        [HttpGet("{id:int}", Name = "GetOrder")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetOrder(int id)
        {
            try
            {
                var query = await _unitOfWork.Orders.Get(q => q.Id == id, new List<string> { "User", "OrderDetails" });
                var result = _mapper.Map<FullOrderDTO>(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetOrder)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(CreateOrder)}");
                return BadRequest(ModelState);
            }

            try
            {
                var query = _mapper.Map<Order>(unitDTO);
                await _unitOfWork.Orders.Insert(query);
                await _unitOfWork.Save();

                return Accepted(new { query });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(CreateOrder)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later."+ex.ToString());
            }
        }


        [HttpPut("{id:int}", Name = "UpdateOrder")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderDTO unitDTO)
        {
            if (!ModelState.IsValid || id < 1)
            {
                _logger.LogError($"Invalid UPDATE attempt in {nameof(UpdateOrder)}");
                return BadRequest(ModelState);
            }

            try
            {
                var query = await _unitOfWork.Orders.Get(q => q.Id == id);
                if (query == null)
                {
                    _logger.LogError($"Invalid UPDATE attempt in {nameof(UpdateOrder)}");
                    return BadRequest("Submitted data is invalid");
                }

                _mapper.Map(unitDTO, query);
                _unitOfWork.Orders.Update(query);
                await _unitOfWork.Save();
                query = await _unitOfWork.Orders.Get(q => q.Id == id);
                return Accepted(new { query });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(UpdateOrder)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }


        [HttpDelete("{id:int}", Name = "DeleteOrder")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            if (id < 1)
            {
                _logger.LogError($"Invalid DELETE attempt in {nameof(DeleteOrder)}");
                return BadRequest();
            }

            try
            {
                var query = await _unitOfWork.Orders.Get(q => q.Id == id);
                if (query == null)
                {
                    _logger.LogError($"Invalid DELETE attempt in {nameof(DeleteOrder)}");
                    var error = "Submitted data is invalid";
                    return BadRequest(new { error });
                }

                await _unitOfWork.Orders.Delete(id);
                await _unitOfWork.Save();

                var success = true;

                return Accepted(new { success });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(DeleteOrder)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }



        [HttpPost("addOrderDetails")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateOrderDetail([FromBody] CreateOrderDetailDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(CreateOrderDetail)}");
                return BadRequest(ModelState);
            }

            try
            {
                var query = _mapper.Map<OrderDetail>(unitDTO);
                await _unitOfWork.OrderDetails.Insert(query);
                await _unitOfWork.Save();

                var success = true;

                return Accepted(new { success });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(CreateOrderDetail)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }
    }



}
