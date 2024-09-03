using System;
using Microsoft.AspNetCore.SignalR;
using RealTimeAppServer.Data;
using RealTimeAppServer.Models;
using RealTimeAppServer.Models.Enums;

namespace RealTimeAppServer.Hubs;

public class ChatHub : Hub
{
    private readonly AppDbContext _context;

    public ChatHub(AppDbContext context)
    {
        _context = context;
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
    }

    public override async Task OnConnectedAsync()
    {
        var customerId = Context.GetHttpContext().Request.Query["customerId"];

        if (!string.IsNullOrEmpty(customerId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, customerId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var customerId = Context.GetHttpContext().Request.Query["customerId"];

        if (!string.IsNullOrEmpty(customerId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, customerId);
        }

        await base.OnDisconnectedAsync(exception);
    }
}
