using LoanApi.Models;
using System.Collections.Concurrent;

namespace LoanApi.Data
{
    public static class LoanRepository
    {
        // concurrent dict to handle concurrency in-memory
        private static ConcurrentDictionary<Guid, Loan> _loans 
            = new ConcurrentDictionary<Guid, Loan>();

        public static IEnumerable<Loan> GetAll() => _loans.Values;

        public static Loan GetById(Guid id)
        {
            _loans.TryGetValue(id, out var loan);
            return loan;
        }

        public static Loan GetByBorrowerName(string borrowerName)
        {
            return _loans.Values.FirstOrDefault(l => 
                l.BorrowerName.Equals(borrowerName, StringComparison.OrdinalIgnoreCase));
        }

        public static void Add(Loan loan)
        {
            _loans.TryAdd(loan.LoanID, loan);
        }

        public static bool Delete(Guid id)
        {
            return _loans.TryRemove(id, out var _);
        }
    }
}
