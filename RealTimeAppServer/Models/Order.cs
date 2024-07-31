using System.Text.Json.Serialization;

namespace RealTimeAppServer.Models;

public class Order
{
    public int Id { get; set; }
    public required string PizzaName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? FinishedAt { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required PizzaStatus Status { get; set; }
    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }
}
