using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MyAPI.Configurations;
using MyAPI.Data;
using MyAPI.DTOs;
using MyAPI.IRepository;
using Newtonsoft.Json.Linq;
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

                var promoInfo = await _unitOfWork.PromotionInfos.Get(q => q.ProductId == query.ProductId, new List<string> { "Promotion" });
                if (promoInfo!=null)
                {
                    if (promoInfo.PromotionAmount != "null")
                    {
                        query.PromotionAmount = promoInfo.PromotionAmount;
                    }
                    if (promoInfo.PromotionPercent!= "null")
                    {
                        query.PromotionPercent = promoInfo.PromotionPercent;
                    }
                }


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
                    var orderedList = result.OrderBy(x => DateTime.ParseExact(x.OrderDate, "dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture)).ToList();
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


        [HttpGet("shipperOrderHistory", Name = "GetShipperOrderHistory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetShipperOrderHistory(string shipperId)
        {
            try
            {
                var count = await _unitOfWork.ShippingInfos.GetCount(q => q.ShipperID == shipperId && q.Order.Status == 3 || q.Order.Status == 4);
                var sil = await _unitOfWork.ShippingInfos.GetAll(q => q.ShipperID == shipperId&&q.Order.Status==3||q.Order.Status==4 , null, new List<string> { "Order" });

                 var result = _mapper.Map<IList<ShippingInfoDTO>>(sil);
                 var orderedList = result.OrderByDescending(x => DateTime.ParseExact(x.deliveryDate, "dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture)).ThenBy(x=>x.Id).ToList();
                return Ok(new { sil=orderedList,count=count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetShipperOrderHistory)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }

        [HttpGet("getOrderShippingInfo", Name = "GetOrderShippingInfo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetOrderShippingInfo(int orderId)
        {
            try
            {
                var sil = await _unitOfWork.ShippingInfos.Get(q => q.OrderId == orderId,new List<string> { "Shipper"});

                var result = _mapper.Map<ShortShippingInfo>(sil);

                return Ok(new { result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetOrderShippingInfo)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + "\n" + ex.ToString());
            }
        }


        [HttpGet("getPaySign", Name = "GetPaySign")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPaySign(string Id,string totalPrice)
        {
            try
            {
                //string endpoint ="https://test-payment.momo.vn/v2/gateway/api/create";
                string partnerCode = "MOMOEVY720210913";
                string accessKey = "Vxo6vQMlwjbrGq3c";
                string serectkey = "u4tghg8QhWdC45JKsl1zaIgB3kXPzc9q";
                string orderInfo = "Thanh toán cho đơn hàng của CircleShop";
                //string redirectUrl = "http://localhost:4200/#/thankyou";
                //string notifyUrl = "http://localhost:4200/#/thankyou";

                string redirectUrl = "http://18110320.000webhostapp.com/#/thankyou";
                string notifyUrl = "http://18110320.000webhostapp.com/#/thankyou";

                //string requestType = "captureWallet";

                string amount = totalPrice;
                string orderId = Id;
                string requestId = Id;
                string extraData = "";

                //Before sign HMAC SHA256 signature

                string rH=
                    "partnerCode=" + partnerCode +
                    "&accessKey=" + accessKey +
                    "&requestId=" + requestId +
                    "&amount=" + amount +
                    "&orderId=" + orderId +
                    "&orderInfo=" + orderInfo +
                    "&returnUrl=" + redirectUrl +
                    "&notifyUrl=" + notifyUrl +
                    "&extraData=" + extraData
                    ;

                MoMoSecurity crypto = new MoMoSecurity();
                string sig= crypto.signSHA256(rH, serectkey);

                return Ok(new { sig,rH,Id,totalPrice });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetPaySign)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }


        [HttpGet("getVNPayUrl", Name = "getVNPayUrl")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetVNPayUrl(int totalPrice)
        {
            try
            {
                string url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
                string returnUrl = "http://18110320.000webhostapp.com/#/thankyou";

                //string returnUrl = "http://localhost:4200/#/thankyou";

                //string tmnCode = "V0A4GQCF";
                //string hashSecret = "CQWPCYYDWRGMVSRNJBXRSOFDJWVSFUHO";

                string tmnCode = "K3IS060E";
                string hashSecret = "TPNMDBCUDPXMJCVFZTSYEKWXPAQHFFPW";

                string price = (totalPrice * 100).ToString();
                string orderInfo = "Thanh toan don hang cho CircleShop";



                PayLib pay = new PayLib();

                pay.AddRequestData("vnp_Version", "2.0.1"); //Phiên bản api mà merchant kết nối. Phiên bản hiện tại là 2.0.0
                pay.AddRequestData("vnp_Command", "pay"); //Mã API sử dụng, mã cho giao dịch thanh toán là 'pay'
                pay.AddRequestData("vnp_TmnCode", tmnCode); //Mã website của merchant trên hệ thống của VNPAY (khi đăng ký tài khoản sẽ có trong mail VNPAY gửi về)
                pay.AddRequestData("vnp_Amount",price); //số tiền cần thanh toán, công thức: số tiền * 100 - ví dụ 10.000 (mười nghìn đồng) --> 1000000
                pay.AddRequestData("vnp_BankCode", ""); //Mã Ngân hàng thanh toán (tham khảo: https://sandbox.vnpayment.vn/apis/danh-sach-ngan-hang/), có thể để trống, người dùng có thể chọn trên cổng thanh toán VNPAY
                pay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss")); //ngày thanh toán theo định dạng yyyyMMddHHmmss
                pay.AddRequestData("vnp_CurrCode", "VND"); //Đơn vị tiền tệ sử dụng thanh toán. Hiện tại chỉ hỗ trợ VND
                pay.AddRequestData("vnp_IpAddr", Util.GetIpAddress()); //Địa chỉ IP của khách hàng thực hiện giao dịch
                pay.AddRequestData("vnp_Locale", "vn"); //Ngôn ngữ giao diện hiển thị - Tiếng Việt (vn), Tiếng Anh (en)
                pay.AddRequestData("vnp_OrderInfo", orderInfo); //Thông tin mô tả nội dung thanh toán
                pay.AddRequestData("vnp_OrderType", "other"); //topup: Nạp tiền điện thoại - billpayment: Thanh toán hóa đơn - fashion: Thời trang - other: Thanh toán trực tuyến
                pay.AddRequestData("vnp_ReturnUrl", returnUrl); //URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán
                pay.AddRequestData("vnp_TxnRef", DateTime.Now.Ticks.ToString()); //mã hóa đơn

                string paymentUrl = pay.CreateRequestUrl(url, hashSecret);


                return Ok(new { paymentUrl });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetVNPayUrl)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }


        [HttpGet("getVNPayUrl2", Name = "getVNPayUrl2")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetVNPayUrl2(int totalPrice)
        {
            try
            {
                //Get Config Info
                //string vnp_Returnurl = "http://localhost:4200/#/thankyou";//URL nhan ket qua tra ve 
                string vnp_Returnurl = "http://18110320.000webhostapp.com/#/thankyou";//URL nhan ket qua tra ve 
                string vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; //URL thanh toan cua VNPAY 
                string vnp_TmnCode = "K3IS060E"; //Ma website
                string vnp_HashSecret = "TPNMDBCUDPXMJCVFZTSYEKWXPAQHFFPW";//Chuoi bi mat

       
                //Get payment input
                VNPayOrderInfo order = new VNPayOrderInfo();
                //Save order to db
                order.OrderId = DateTime.Now.Ticks; // Giả lập mã giao dịch hệ thống merchant gửi sang VNPAY
                order.Amount = totalPrice; // Giả lập số tiền thanh toán hệ thống merchant gửi sang VNPAY 100,000 VND
                order.Status = "0"; //0: Trạng thái thanh toán "chờ thanh toán" hoặc "Pending"
                order.OrderDesc = "Thanh toan don hang cho CircleShop";
                order.CreatedDate = DateTime.Now;
                string locale = "vn";
                //Build URL for VNPAY
                VnPayLibrary vnpay = new VnPayLibrary();

                vnpay.AddRequestData("vnp_Version", VnPayLibrary.VERSION);
                vnpay.AddRequestData("vnp_Command", "pay");
                vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
                vnpay.AddRequestData("vnp_Amount", (order.Amount * 100).ToString()); //Số tiền thanh toán. Số tiền không mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 100,000 VND (một trăm nghìn VNĐ) thì merchant cần nhân thêm 100 lần (khử phần thập phân), sau đó gửi sang VNPAY là: 10000000
                vnpay.AddRequestData("vnp_BankCode", ""); //Mã Ngân hàng thanh toán (tham khảo: https://sandbox.vnpayment.vn/apis/danh-sach-ngan-hang/), có thể để trống, người dùng có thể chọn trên cổng thanh toán VNPAY
                vnpay.AddRequestData("vnp_CreateDate", order.CreatedDate.ToString("yyyyMMddHHmmss"));
                vnpay.AddRequestData("vnp_CurrCode", "VND");
                vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress());
                if (!string.IsNullOrEmpty(locale))
                {
                    vnpay.AddRequestData("vnp_Locale", locale);
                }
                else
                {
                    vnpay.AddRequestData("vnp_Locale", "vn");
                }
                vnpay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang:" + order.OrderId);
                vnpay.AddRequestData("vnp_OrderType", "Other"); //default value: other
                vnpay.AddRequestData("vnp_ReturnUrl", vnp_Returnurl);
                vnpay.AddRequestData("vnp_TxnRef", DateTime.Now.Ticks.ToString()); // Mã tham chiếu của giao dịch tại hệ thống của merchant. Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY. Không được trùng lặp trong ngày

                //Add Params of 2.1.0 Version
                vnpay.AddRequestData("vnp_ExpireDate", "20221003135123");
   

                string paymentUrl = vnpay.CreateRequestUrl(vnp_Url, vnp_HashSecret);

                return Ok(new { paymentUrl });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(GetVNPayUrl)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            }
        }

    }





}
