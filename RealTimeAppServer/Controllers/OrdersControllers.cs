using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RealTimeAppServer.Data;
using RealTimeAppServer.Hubs;
using RealTimeAppServer.Models;

namespace RealTimeAppServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<DataHub> _hubContext;

    public OrdersController(AppDbContext context, IHubContext<DataHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders([FromQuery] string? customerId)
    {
        if (string.IsNullOrEmpty(customerId))
            return await _context.Orders.Include(o => o.Customer).ToListAsync();

        return await _context
            .Orders.Include(o => o.Customer)
            .Where(o => o.CustomerId == int.Parse(customerId))
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Order>> PostOrder(Order order)
    {
        order.CreatedAt = DateTime.UtcNow;
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var completeOrder = await _context
            .Orders.Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.Id == order.Id);

        await _hubContext.Clients.All.SendAsync("ReceiveOrder", completeOrder);

        return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutOrder(int id, Order updatedOrder)
    {
        var order = await _context
            .Orders.Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
        {
            return NotFound();
        }

        order.PizzaName = updatedOrder.PizzaName;
        order.FinishedAt = updatedOrder.FinishedAt;
        order.Status = updatedOrder.Status; // Update status

        _context.Orders.Update(order);
        await _context.SaveChangesAsync();

        // Notify clients via SignalR
        await _hubContext.Clients.All.SendAsync("UpdateOrder", order);

        return NoContent();
    }

    [HttpPut("advance/{id}")]
    public async Task<IActionResult> MarkAsDone(int id)
    {
        var order = await _context
            .Orders.Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
            return NotFound();

        if (order.Status != PizzaStatus.Completed)
            order.Status++;
        else
            return NoContent();

        if (order.Status == PizzaStatus.Completed)
            order.FinishedAt = DateTime.UtcNow;

        _context.Orders.Update(order);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("UpdateOrder", order);

        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteOrders([FromQuery] int? orderId)
    {
        if (orderId != null)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return NotFound();
            _context.Orders.Remove(order);
        }
        else
        {
            var allOrders = await _context.Orders.ToListAsync();
            _context.Orders.RemoveRange(allOrders);
        }

        await _context.SaveChangesAsync();
        return Ok();
    }

    private bool OrderExists(int id)
    {
        return _context.Orders.Any(e => e.Id == id);
    }
}
