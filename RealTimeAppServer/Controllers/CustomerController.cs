using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealTimeAppServer.Data;
using RealTimeAppServer.Models;

namespace RealTimeAppServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CustomersController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers([FromQuery] int? customerId)
    {
        if (customerId.HasValue)
        {
            return await _context.Customers.Where(c => c.Id == customerId).ToListAsync();
        }

        return await _context.Customers.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCustomers), new { id = customer.Id }, customer);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteCustomer([FromQuery] int? customerId)
    {
        if (customerId != null)
        {
            var customer = await _context.Customers.FindAsync(customerId);
            if (customer == null)
                return NotFound();
            _context.Customers.Remove(customer);
        }
        else
        {
            var allCustomers = await _context.Customers.ToListAsync();
            _context.Customers.RemoveRange(allCustomers);
        }

        await _context.SaveChangesAsync();
        return Ok();
    }
}
