namespace Cart.Models
{
    public class Cart
    {
        public List<Product> Products { get; set; }
        public decimal TotalPrice { get; set; }
    }
}