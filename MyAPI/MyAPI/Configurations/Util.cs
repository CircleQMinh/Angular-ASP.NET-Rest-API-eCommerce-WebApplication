using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using MyAPI.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MyAPI.Configurations
{

    public class Util
    {
        private static Random random = new Random();
        public static string Md5(string sInput)
        {
            HashAlgorithm algorithmType = default(HashAlgorithm);
            ASCIIEncoding enCoder = new ASCIIEncoding();
            byte[] valueByteArr = enCoder.GetBytes(sInput);
            byte[] hashArray = null;
            // Encrypt Input string 
            algorithmType = new MD5CryptoServiceProvider();
            hashArray = algorithmType.ComputeHash(valueByteArr);
            //Convert byte hash to HEX
            StringBuilder sb = new StringBuilder();
            foreach (byte b in hashArray)
            {
                sb.AppendFormat("{0:x2}", b);
            }
            return sb.ToString();
        }

        public static string Sha256(string data)
        {
            using (var sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                var bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(data));

                // Convert byte array to a string   
                var builder = new StringBuilder();
                foreach (var t in bytes)
                {
                    builder.Append(t.ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public static string GetIpAddress()
        {
            return "113.172.68.41";

        }

        public double CalculateOrderWorth(Order o)
        {

            var shippingFee = new ShopSetting().shippingFee;
            double worth = o.TotalPrice;
            if (o.ShippingFee==1)
            {
                worth += shippingFee;
            }
            if (o.discountCode!=null)
            {
                if (o.discountCode.DiscountAmount!="null")
                {
                    worth -= double.Parse(o.discountCode.DiscountAmount);
                }
                else
                {
                    worth -= worth * double.Parse(o.discountCode.DiscountPercent) / 100;
                }
            }
            return worth;
        }

        public string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
