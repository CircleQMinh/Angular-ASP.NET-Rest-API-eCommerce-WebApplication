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

                return Accepted(new { order=query,order_id=query.Id });
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


        [HttpGet("getOrderDetails")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetOrderDetail(int id)
        {

            try
            {
                Expression<Func<OrderDetail, bool>> expression = q=>q.OrderId==id;
                var query = await _unitOfWork.OrderDetails.GetAll(expression,null,new List<string> {"Product"});
                var results = _mapper.Map<IList<FullOrderDetailDTO>>(query);
                var success = true;

                return Accepted(new { success,orderDetails=results });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetOrderDetail)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }


        [HttpGet("availableOrder", Name = "GetAvailableOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAvailableOrder(int status, string order, int pageNumber, int pageSize, string orderDir)
        {
            try
            {
                Func<IQueryable<Order>, IOrderedQueryable<Order>> orderBy = null;
                Expression<Func<Order, bool>> expression = null;
                int flag = 0;
                switch (order)
                {
                    case "Price":
                        if (orderDir == "Desc")
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
                if (flag == 1)
                {

                    var query = await _unitOfWork.Orders.GetAll(expression, orderBy, null);
                    var result = _mapper.Map<IList<OrderDTO>>(query);
                    var orderedList = result.OrderBy(x => DateTime.Parse(x.OrderDate)).ToList();
                    List<OrderDTO> list = new List<OrderDTO>();
                    if (orderDir == "Desc")
                    {
                        orderedList.Reverse();
                    }
                    for (int i = 0; i < pageSize; i++)
                    {
                        if ((i + pageSize * (pageNumber - 1)) < orderedList.Count)
                        {
                            list.Add(orderedList[i + pageSize * (pageNumber - 1)]);
                        }
                    }

                    return Ok(new { result = list, count = orderedList.Count });
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
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetAvailableOrder)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }

        [HttpPost("acceptOrder")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AcceptOrder(string shipperId,int orderId)
        {

            var existingShipper = await _unitOfWork.Users.Get(q => q.Id == shipperId);
            if (existingShipper==null)
            {
                return  BadRequest("Shipper not exist");
            }
            var existingOrder = await _unitOfWork.Orders.Get(q => q.Id == orderId);
            if (existingOrder==null)
            {
                return BadRequest("Order not exist");
            }
            if (existingOrder.Status!=1)
            {
                return BadRequest("Order not valid");
            }
            try
            {
                ShippingInfo si = new ShippingInfo();
                si.OrderId = existingOrder.Id;
                si.ShipperID = existingShipper.Id;
                await _unitOfWork.ShippingInfos.Insert(si);
                existingOrder.Status = 2;
                _unitOfWork.Orders.Update(existingOrder);
                await _unitOfWork.Save();


                return Accepted(new {si });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(AcceptOrder)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }

        [HttpGet("acceptedOrder", Name = "GetAcceptedOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAcceptedOrder(string shipperId)
        {
            try
            {
                var sil = await _unitOfWork.ShippingInfos.GetAll(q => q.ShipperID == shipperId&&q.Order.Status==2,null,new List<string> { "Order"});

                return Ok(new {sil });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetAcceptedOrder)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }

        [HttpPost("finishOrder")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> FinishOrder([FromBody] FinishOrderDTO unitDTO)
        {

            var existingShipper = await _unitOfWork.Users.Get(q => q.Id == unitDTO.shipperId);          
            if (existingShipper == null)
            {
                return BadRequest("Shipper not exist");
            }
            var existingOrder = await _unitOfWork.Orders.Get(q => q.Id == unitDTO.orderId);
            if (existingOrder == null)
            {
                return BadRequest("Order not exist");
            }
            if (existingOrder.Status != 2)
            {
                return BadRequest("Order not valid");
            }
            try
            {
                ShippingInfo si = await _unitOfWork.ShippingInfos.Get(q => q.OrderId == unitDTO.orderId && q.ShipperID == unitDTO.shipperId);
                si.deliveryDate = unitDTO.date;
                existingOrder.Status = unitDTO.status;
                existingOrder.Note = unitDTO.note;

                _unitOfWork.Orders.Update(existingOrder);
                _unitOfWork.ShippingInfos.Update(si);
                await _unitOfWork.Save();
                return Accepted(new { si });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(FinishOrder)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }


        [HttpGet("finishedOrder", Name = "GetFinishedOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetFinishedOrder(string shipperId)
        {
            try
            {
                var sil = await _unitOfWork.ShippingInfos.GetAll(q => q.ShipperID == shipperId , null, new List<string> { "Order" });

                 var result = _mapper.Map<IList<ShippingInfoDTO>>(sil);
                 var orderedList = result.OrderBy(x => x.Order.Status).ThenBy(x=>x.Id).ToList();
                return Ok(new { sil=orderedList });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetFinishedOrder)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }
    }



}
