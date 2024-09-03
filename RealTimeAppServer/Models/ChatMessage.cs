using System;
using RealTimeAppServer.Models.Enums;

namespace RealTimeAppServer.Models;

public class ChatMessage
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public required ChatMessageSender Sender { get; set; }
    public required string Message { get; set; }
    public DateTime Timestamp { get; set; }
}
