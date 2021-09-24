using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Data
{
    public class EmployeeInfo

    {
        public int Id { get; set; }
        [ForeignKey(nameof(EmployeeID))]
        public string EmployeeID { get; set; }
        public virtual APIUser Employee { get; set; }

        public string Address { get; set; }
        public string Sex { get; set; }
        public int Salary { get; set; }
        public string CMND { get; set; }
        public string StartDate { get; set; }
        public int Status { get; set; }
    }
}
