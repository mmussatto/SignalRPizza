using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RealTimeAppServer.Data;
using RealTimeAppServer.Hubs;
using RealTimeAppServer.Models;

namespace RealTimeAppServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DataController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<DataHub> _hubContext;

    public DataController(AppDbContext context, IHubContext<DataHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DataItem>>> GetDataItems()
    {
        return await _context.DataItems.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<DataItem>> PostDataItem(DataItem dataItem)
    {
        _context.DataItems.Add(dataItem);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("ReceiveMessage", dataItem);

        return CreatedAtAction(nameof(GetDataItems), new { id = dataItem.Id }, dataItem);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutDataItem(int id, DataItem dataItem)
    {
        if (id != dataItem.Id)
        {
            return BadRequest();
        }

        _context.Entry(dataItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("UpdateDataItem", dataItem);
        }
        catch
        {
            if (!DataItemExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        return NoContent();
    }

    private bool DataItemExists(int id)
    {
        return _context.DataItems.Any(e => e.Id == id);
    }
}
