using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealTimeAppServer.Data;
using RealTimeAppServer.Models;

namespace RealTimeAppServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _context;

    public ChatController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{customerId}")]
    public async Task<ActionResult<IEnumerable<ChatMessage>>> GetChatMessages(int customerId)
    {
        return await _context
            .ChatMessages.Where(m => m.CustomerId == customerId)
            .OrderBy(m => m.Timestamp)
            .ToListAsync();
    }
}
