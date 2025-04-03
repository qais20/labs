namespace LoanApi.Models
{
    public class Loan
    {
        public Guid LoanID { get; set; }       // unique load ID
        public string BorrowerName { get; set; }
        public decimal RepaymentAmount { get; set; }
        public decimal FundingAmount { get; set; }
    }
}
