import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { Product } from "./Main";
import Search from "./Search";
import { apiService } from "@/service/api-service";
import Cart from "./Cart";
import ProductDialog from "./ProductDialog";
import { toast, ToastContainer } from "react-toastify"; // Importing toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importing toastify CSS

function Landing() {
  const [product, setProduct] = useState<Product[]>([]);
  const navigate = useNavigate(); // Hook for navigation

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Get cart from localStorage
  const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
  const [cart, setCart] =
    useState<{ product: Product; quantity: number }[]>(savedCart);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set number of items per page

  const fetchData = async () => {
    try {
      const response = await apiService.getAllProducts();
      setProduct(response);
      setFilteredProducts(response); // Initially show all products
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryClick = (category: string) => {
    // Navigate to the Main component with the selected category in the URL
    navigate(`/category/${category}`);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    const existingCartItem = cart.find(
      (item) => item.product.id === product.id
    );
    setQuantity(existingCartItem ? existingCartItem.quantity : 1); // Pre-fill quantity if the product is already in the cart
    setIsDialogOpen(true);
  };

  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeCartItem = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const clearCart = () => {
    setCart([]); // Clear the cart
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredProducts(product); // If no search term, show all products
    } else {
      // First check if the search term matches a category
      const isCategorySearch = product.some(
        (item) => item.category.toLowerCase() === searchTerm.toLowerCase()
      );

      if (isCategorySearch) {
        // Filter by category
        const filteredByCategory = product.filter(
          (item) => item.category.toLowerCase() === searchTerm.toLowerCase()
        );
        setFilteredProducts(filteredByCategory);
        if (filteredByCategory.length === 0) {
          toast.error("No products found in this category!"); // Show error toast if no products found
        }
      } else {
        // Otherwise, search by product name or category
        const filteredByNameOrCategory = product.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filteredByNameOrCategory);
        if (filteredByNameOrCategory.length === 0) {
          toast.error("No products found for this search!"); // Show error toast if no products found
        }
      }
    }
  };

  // Calculate the products to display based on current page
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-6 lg:px-40 space-y-20">
      <nav className="flex items-center justify-between">
        <div>
          <img src={Logo} alt="Logo" />
        </div>

        <div className="flex flex-col md:flex md:flex-row items-center gap-2">
          <div className="flex items-center justify-center border border-[#2E3A6E] bg-[#2E3A6E] text-white rounded-full p-2 w-10 h-10">
            JK
          </div>
          <p className="text-center">John Kennedy</p>
        </div>
      </nav>
      <section className="w-full space-y-10">
        <Search onSearch={handleSearch} />

        <div className="space-y-8">
          <p>Order Again!</p>

          <div className="md:flex md:gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-20">
              {currentProducts.map((item) => (
                <div
                  key={item.id}
                  className="w-full space-y-4 cursor-pointer"
                  onClick={() => handleProductClick(item)}
                >
                  <div className="w-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-md lg:w-[250px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>{item.title}</p>
                    <span>${item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <Cart
              cart={cart}
              updateCartItemQuantity={updateCartItemQuantity}
              removeCartItem={removeCartItem}
              clearCart={clearCart}
            />

            <ProductDialog
              product={selectedProduct}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              cart={cart}
              setCart={setCart}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>
        </div>

        <div className="flex flex-col gap-10 items-center justify-center">
          <h2>Categories</h2>

          <ul className="flex items-center justify-center gap-4 md:gap-10">
            {[...new Set(product.map((item) => item.category))].map(
              (category, index) => (
                <li
                  key={index}
                  className="cursor-pointer border rounded-3xl border-[#0A1853] p-2"
                  onClick={() => handleCategoryClick(category)} // Navigate to the selected category
                >
                  {category}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Next
          </button>
        </div>
      </section>
      <ToastContainer /> {/* Add ToastContainer here to show toasts */}
    </div>
  );
}

export default Landing;
