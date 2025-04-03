using Microsoft.AspNetCore.Mvc;
using LoanApi.Data;
using LoanApi.Models;

namespace LoanApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoanController : ControllerBase
    {
        [HttpPost]
        public ActionResult<Loan> AddLoan([FromBody] Loan newLoan)
        {
            if (newLoan.LoanID == Guid.Empty)
                newLoan.LoanID = Guid.NewGuid();

            LoanRepository.Add(newLoan);
            return Ok(newLoan);
        }

        [HttpGet]
        public ActionResult<Loan> GetLoanByBorrowerName([FromQuery] string borrowerName)
        {
            var loan = LoanRepository.GetByBorrowerName(borrowerName);
            if (loan == null)
                return NotFound($"No loan found for borrower {borrowerName}");
            return Ok(loan);
        }

        [HttpGet("{id:guid}")]
        public ActionResult<Loan> GetLoanById(Guid id)
        {
            var loan = LoanRepository.GetById(id);
            if (loan == null)
                return NotFound($"No loan found with ID {id}");
            return Ok(loan);
        }

        [HttpDelete("{id:guid}")]
        public IActionResult DeleteLoan(Guid id)
        {
            var success = LoanRepository.Delete(id);
            if (!success)
                return NotFound($"No loan found with ID {id}");
            return Ok($"Loan with ID {id} deleted");
        }

        [HttpGet("all")]
        public ActionResult<IEnumerable<Loan>> GetAllLoans()
        {
            return Ok(LoanRepository.GetAll());
        }
    }
}
