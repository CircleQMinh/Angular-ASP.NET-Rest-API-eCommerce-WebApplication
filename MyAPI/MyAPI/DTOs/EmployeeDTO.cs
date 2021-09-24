using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.DTOs
{
    public class EmployeeDTO
    {
        public string EmployeeID { get; set; }

        public string Address { get; set; }
        public string Sex { get; set; }
        public int Salary { get; set; }
        public string CMND { get; set; }
        public string StartDate { get; set; }
        public int Status { get; set; }
    }

    public class EditEmployeeDTO 
    {
        public string EmployeeID { get; set; }

        public string Address { get; set; }
        public string imgUrl { get; set; }
        public string Sex { get; set; }
        public int Salary { get; set; }
        public string CMND { get; set; }
        public string StartDate { get; set; }
        public int Status { get; set; }

        public string DisplayName { get; set; }

        public string PhoneNumber { get; set; }
        public ICollection<string> Roles { get; set; }
    }
}
