namespace RealTimeAppServer.Models;

public class Customer
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Phone { get; set; }
    public string? Email { get; set; }
    public IEnumerable<Order>? Orders { get; set; }
}
