using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.Net.Mail;
using System.Net;
using MyAPI.Data;
using MyAPI.DTOs;

namespace MyAPI.Configurations
{
    public class EmailHelper
    {
        public string site = "http://localhost:4200/#/";
        public string siteOnline = "http://circleqm31052000-001-site1.itempurl.com/#/";
        public int shippingFee = 15000;
        public string SendEmailConfirm(string userEmail, string token,string username)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("timelive.circleqm@gmail.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Xác thực email cho tài khoản của bạn";
            mailMessage.IsBodyHtml = true;

            string encodetk = token.Replace("+", "%2B"); ;
            string link = site+ "confirmAccount?email=" + userEmail+"&token="+encodetk;
            string linkOnline = siteOnline + "confirmAccount?email=" + userEmail + "&token=" + encodetk;

            mailMessage.Body = "<!DOCTYPE html><html><head> <title></title> <meta charset='utf-8' /> " +
                "<style> table, th, td { border: 1px solid black; } </style></head><body style='font-family: monospace;'>" +
                " <br /> <table width='100%'> <tr> <td style='background-color:#97b6e4;text-align: center;'> " +
                "<img src='https://res.cloudinary.com/dkmk9tdwx/image/upload/v1628192627/logo_v5ukvv.png' " +
                "style='width: 45px;height: 45px'> <h1 >Circle" + "'s" + " Shop</h1> </td> </tr> <tr> <td style='text-align: center;padding: 20px;'> " +
                "<p>Thân gửi " + username + ", <p> <p>Cảm ơn bạn đã đăng ký tài khoản, hãy nhấn vào link ở dưới để hoàn thành quá trình đăng ký tài khoản! </p> <br />" +
                " <a href='"+linkOnline+"' style='background-color: red;padding: 10px;'> Click vào đây để xác nhận tài khoản! </a>" +
                " </td> </tr> <tr> <td style='background-color:#d6ffa6'> <h2>Liên hệ với cửa hàng</h2> <p>Cửa hàng mua thực phẩm online TP.HCM." +
                " Chuyên bán các loại rau sạch, củ quả, trái cây, thực phẩm tươi sống</p> <p>Địa chỉ : 23/25D đường số 1, phường Bình Thuận, Q.7, " +
                "TP.HCM</p> <p>Email : 18110320@student.hcmute.edu.vn</p> <p>Hot line : 0788283308</p> " +
                "<p>Debug (local-link) : <a href='"+link+"' style='background-color: red;padding: 10px;'> Link debug local! </a></p> </td> </tr> </table></body></html>";


            var client = new SmtpClient("smtp.gmail.com", Convert.ToInt32(587))
            {
                Credentials = new NetworkCredential("timelive.circleqm@gmail.com", "5YemExFc!6QpT+aT"),
                EnableSsl = true,
                UseDefaultCredentials = false, // ?? :D ??
                DeliveryMethod = SmtpDeliveryMethod.Network
            };

            try
            {
                client.Send(mailMessage);
                return "true";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }


        public string SendEmailResetPassword(string userEmail, string token, string username)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("timelive.circleqm@gmail.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Khôi phục mật khẩu cho tài khoản của bạn";
            mailMessage.IsBodyHtml = true;

            string encodetk = token.Replace("+", "%2B");
            string link = site + "reset-password?email=" + userEmail + "&token=" + encodetk;
            string linkOnline = siteOnline + "reset-password?email=" + userEmail + "&token=" + encodetk;
            mailMessage.Body = "<!DOCTYPE html><html><head> <title></title> <meta charset='utf-8' /> " +
                "<style> table, th, td { border: 1px solid black; } </style></head><body style='font-family: monospace;'>" +
                " <br /> <table width='100%'> <tr> <td style='background-color:#97b6e4;text-align: center;'> " +
                "<img src='https://res.cloudinary.com/dkmk9tdwx/image/upload/v1628192627/logo_v5ukvv.png' " +
                "style='width: 45px;height: 45px'> <h1 >Circle" + "'s" + " Shop</h1> </td> </tr> <tr> <td style='text-align: center;padding: 20px;'> " +
                "<p>Thân gửi " + username + ", <p> <p>Bạn đã gửi yêu cầu reset mật khẩu, hãy click vào link bên dưới để reset mật khẩu bạn!</p> <br />" +
                " <a href='" + linkOnline + "' style='background-color: red;padding: 10px;'> Click vào đây để xác nhận đổi mật khẩu! </a>" +
                " </td> </tr> <tr> <td style='background-color:#d6ffa6'> <h2>Liên hệ với cửa hàng</h2> <p>Cửa hàng mua thực phẩm online TP.HCM." +
                " Chuyên bán các loại rau sạch, củ quả, trái cây, thực phẩm tươi sống</p> <p>Địa chỉ : 23/25D đường số 1, phường Bình Thuận, Q.7, " +
                "TP.HCM</p> <p>Email : 18110320@student.hcmute.edu.vn</p> <p>Hot line : 0788283308</p> " +
                "<p>Debug (local-link) : <a href='" + link + "' style='background-color: red;padding: 10px;'> Link debug local! </a></p> </td> </tr> </table></body></html>";



            var client = new SmtpClient("smtp.gmail.com", Convert.ToInt32(587))
            {
                Credentials = new NetworkCredential("timelive.circleqm@gmail.com", "5YemExFc!6QpT+aT"),
                EnableSsl = true,
                UseDefaultCredentials = false, // ?? :D ??
                DeliveryMethod = SmtpDeliveryMethod.Network
            };

            try
            {
                client.Send(mailMessage);
                return "true";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public string SendEmailWithOrderInfo(string userEmail, Order order, IList<FullOrderDetailDTO> od)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("timelive.circleqm@gmail.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Đơn hàng của bạn đã được ghi nhận - Mã đơn hàng : "+order.Id;
            mailMessage.IsBodyHtml = true;

            //string encodetk = token.Replace("+", "%2B");
            //string link = site + "reset-password?email=" + userEmail + "&token=" + encodetk;
            //string linkOnline = siteOnline + "reset-password?email=" + userEmail + "&token=" + encodetk;
          
            string msg = "<!DOCTYPE html><html><head> <title></title> <meta charset='utf-8' /> <style> table, th, td { border: 1px solid black; } " +
                "</style></head><body style='font-family: monospace;'> <br /> <table width='100%'> <tr> <td style='background-color:#97b6e4;text-align: center;'>" +
                " <img src='https://res.cloudinary.com/dkmk9tdwx/image/upload/v1628192627/logo_v5ukvv.png' style='width: 45px;height: 45px'> <h1>Circle"+"'s"+" Shop</h1> " +
                "</td> </tr> <tr> <td style='text-align: center;padding: 20px;'>" +
                " <p>Thân gửi " + order.ContactName + " <p> " +
                "<p>Chúng tôi đã ghi lại thông tin đơn hàng của bạn như sau :" +
                " </p> <table style='margin-left: 20%;width: 60%;'> <tr> <td style='width: 100px;'> " +
                "Tên người nhận :</td> <td>"+order.ContactName+"</td> </tr> <tr> <td style='width: 100px;'>" +
                " Email :</td> <td>" + order.Email + "</td> </tr> <tr> <td style='width: 100px;'>" +
                "SDT :</td> <td>" + order.Phone + " </td> </tr> </table> <p>và các sản phẩm của đơn hàng như sau: " +
                "<table style='margin-left: 10%;width: 80%;'> <thead> <tr> <td>STT</td> <td>Tên</td> <td>Số lượng</td> </tr> </thead> <tbody>";
            for (int i=0;i<od.Count;i++)
            {
                msg = msg + "<tr> <td>"+(i+1)+"</td> <td>"+od[i].Product.Name+"</td> <td>"+od[i].Quantity+"</td> </tr>";
            }

            if (order.TotalPrice>=200000)
            {
                shippingFee = 0;
            }

            msg += "</tbody> </table> <p>Tổng giá trị đơn hàng : " + order.TotalPrice + " đ - Phí vận chuyển : "+shippingFee+" đ</p>  " +
                "<p>Tổng cộng : " + (order.TotalPrice+shippingFee) + " đ </p> " +
                "<p>Đơn hàng của bạn đang được xử lý. Hãy theo dõi trạng thái của đơn hàng trên trang profile của bạn!</p> </td> </tr> <tr> " +
                "<td style='background-color:#d6ffa6'> <h2>Liên hệ với cửa hàng</h2> <p>Cửa hàng mua thực phẩm online TP.HCM. Chuyên bán các loại rau " +
                "sạch, củ quả, trái cây, thực phẩm tươi sống</p> " +
                "<p>Địa chỉ : 23/25D đường số 1, phường Bình Thuận, Q.7, TP.HCM</p> " +
                "<p>Email : 18110320@student.hcmute.edu.vn</p> " +
                "<p>Hot line : 0788283308</p> </td> </tr> </table></body></html>";
            mailMessage.Body = msg;
            var client = new SmtpClient("smtp.gmail.com", Convert.ToInt32(587))
            {
                Credentials = new NetworkCredential("timelive.circleqm@gmail.com", "5YemExFc!6QpT+aT"),
                EnableSsl = true,
                UseDefaultCredentials = false, // ?? :D ??
                DeliveryMethod = SmtpDeliveryMethod.Network
            };

            try
            {
                client.Send(mailMessage);
                return "true";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}
