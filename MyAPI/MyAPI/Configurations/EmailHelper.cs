using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.Net.Mail;
using System.Net;

namespace MyAPI.Configurations
{
    public class EmailHelper
    {
        public string site = "http://localhost:4200/#/";
        public string siteOnline = "http://circle-shop-18110320.000webhostapp.com/#/";
        public string SendEmailConfirm(string userEmail, string token)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("timelive.circleqm@gmail.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Confirm your email";
            mailMessage.IsBodyHtml = true;

            string encodetk=token.Replace("+", "%2B");
            string link = site+ "confirmAccount?email=" + userEmail+"&token="+encodetk;
            string linkOnline = siteOnline + "confirmAccount?email=" + userEmail + "&token=" + encodetk;

            mailMessage.Body = "Please comfirm your account by using this link here(localhost): " + link +"<br>"+
                "Please comfirm your account by using this link here(online): " + linkOnline + "<br>";

     

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


        public string SendEmailResetPassword(string userEmail, string token)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("timelive.circleqm@gmail.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Reset your password";
            mailMessage.IsBodyHtml = true;

            string encodetk = token.Replace("+", "%2B");
            string link = site + "reset-password?email=" + userEmail + "&token=" + encodetk;
            string linkOnline = siteOnline + "reset-password?email=" + userEmail + "&token=" + encodetk;
            mailMessage.Body = "Please comfirm your password reset request by using this link here(localhost): " + link+"<br>"+
                "Please comfirm your password reset request by using this link here(online): " + linkOnline + "<br>";



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
