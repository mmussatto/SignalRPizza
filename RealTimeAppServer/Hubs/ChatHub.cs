using System;
using Microsoft.AspNetCore.SignalR;
using RealTimeAppServer.Data;
using RealTimeAppServer.Models;
using RealTimeAppServer.Models.Enums;

namespace RealTimeAppServer.Hubs;

public class ChatHub : Hub
{
    private readonly AppDbContext _context;
    private ILogger<ChatHub> _logger;

    public ChatHub(AppDbContext context, ILogger<ChatHub> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SendMessage(int customerId, string sender, string message)
    {
        if (!Enum.TryParse(sender, out ChatMessageSender senderEnum))
        {
            // Handle the case where the sender string is not a valid enum value
            throw new ArgumentException("Invalid sender value");
        }

        var chatMessage = new ChatMessage
        {
            CustomerId = customerId,
            Sender = senderEnum,
            Message = message,
            Timestamp = DateTime.UtcNow
        };

        _context.ChatMessages.Add(chatMessage);
        await _context.SaveChangesAsync();

        await Clients.Group(customerId.ToString()).SendAsync("ReceiveMessage", chatMessage);

        _logger.LogInformation($"Message sent to customer {customerId} from {sender}: {message}");
    }

    public async Task JoinGroup(int customerId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, customerId.ToString());

        _logger.LogInformation($"Customer {customerId} joined the group");
    }

    public async Task LeaveGroup(int customerId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, customerId.ToString());

        _logger.LogInformation($"Customer {customerId} left the group");
    }

    // public override async Task OnConnectedAsync()
    // {
    //     await base.OnConnectedAsync();
    // }

    // public override async Task OnDisconnectedAsync(Exception exception)
    // {
    //     await base.OnDisconnectedAsync(exception);
    // }
}
