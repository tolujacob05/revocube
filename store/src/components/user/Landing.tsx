import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { Product } from "./Main";
import Search from "./Search";
import { apiService } from "@/service/api-service";
import Cart from "./Cart";
import ProductDialog from "./ProductDialog";
import { toast, ToastContainer } from "react-toastify"; // Importing toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importing toastify CSS
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";

function Landing() {
  const [product, setProduct] = useState<Product[]>([]);
  const navigate = useNavigate(); // Hook for navigation
  const cartSectionRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    setLoading(true); // Start loading
    try {
      const response = await apiService.getAllProducts();
      setProduct(response);
      setFilteredProducts(response); // Initially show all products
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryClick = (category: string) => {
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling effect
    });
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

  // Scroll to the cart section
  const handleCartClick = () => {
    if (cartSectionRef.current) {
      cartSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="px-6 space-y-20 lg:px-40">
      <nav className="flex items-center justify-between">
        <div>
          <img src={Logo} alt="Logo" />
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {" "}
                <div className="flex items-center justify-center w-10 h-10 m-1 rounded-full">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full hover:bg-secondary/50"
                  >
                    <Icon
                      icon="bxs:user"
                      width="17"
                      height="17"
                      className="text-primary/50"
                    />
                  </Button>
                </div>
                <span className="hidden pl-2 text-muted-foreground md:block">
                  John Kennedy
                </span>{" "}
              </NavigationMenuTrigger>

              <NavigationMenuContent className="w-[100px] p-4 py-2 space-y-1 flex flex-col justify-center items-center">
                <NavigationMenuLink className="text-black hover:text-primary w-[100px] text-nowrap text-center text-sm">
                  My Account
                </NavigationMenuLink>
                <Separator />
                <NavigationMenuLink
                  className="relative cursor-pointer"
                  onClick={handleCartClick}
                >
                  <p className="flex gap-2 text-sm text-center text-muted-foreground hover:text-primary">
                    Cart
                    <Icon
                      icon="emojione:shopping-cart"
                      width="17"
                      height="17"
                      className="text-primary/50"
                    />
                  </p>
                  {/* Counter */}
                  {cart.length > 0 && (
                    <div className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-4">
                      {cart.length}
                    </div>
                  )}
                </NavigationMenuLink>
                <Separator />
                <NavigationMenuLink className="text-sm text-center text-muted-foreground hover:text-primary">
                  Logout
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      <section className="w-full space-y-10">
        <Search onSearch={handleSearch} />

        <div className="space-y-8">
          <p>Order Again!</p>

          <div className="md:flex md:gap-4">
            {loading ? (
              // Display Skeletons while loading
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                {[...Array(5)].map((_, index) => (
                  <div className="flex flex-col space-y-3" key={index}>
                    <Skeleton className="h-[125px] w-[150px] md:w-[250px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px] md:w-[250px]" />
                      <Skeleton className="h-4 w-[150px] md:w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Display products once loaded
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                {currentProducts.map((item) => (
                  <div
                    key={item.id}
                    className="space-y-4 cursor-pointer"
                    onClick={() => handleProductClick(item)}
                  >
                    <img
                      alt={item.title}
                      src={item.image}
                      className="w-full h-56 transition shadow-xl object-fit rounded-xl"
                    />

                    <div className="flex flex-col gap-2">
                      <p>{item.title}</p>
                      <span>${item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <Cart
                cart={cart}
                updateCartItemQuantity={updateCartItemQuantity}
                removeCartItem={removeCartItem}
                clearCart={clearCart}
                ref={cartSectionRef}
              />
            </div>

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

        <div className="flex flex-col items-center justify-center gap-10">
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
            className="px-4 py-2 text-white bg-blue-500 rounded-md"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-white bg-blue-500 rounded-md"
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
