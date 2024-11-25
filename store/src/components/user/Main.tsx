import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { apiService } from "@/service/api-service";
import Navbar from "./Navbar";
import Cart from "./Cart";
import ProductDialog from "./ProductDialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Skeleton } from "@/components/ui/skeleton";

export type Product = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
};

function Main() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    category || null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
  const [cart, setCart] =
    useState<{ product: Product; quantity: number }[]>(savedCart);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cartSectionRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch products on mount
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllProducts();
      setProduct(response);

      // Filter products based on category, if applicable
      setFilteredProducts(
        category
          ? response.filter((item: any) => item.category === category)
          : response
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [category]); // Dependencies include 'category'

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependencies include the memoized 'fetchData'

  // Update `filteredProducts` when `selectedCategory` or `product` changes
  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(
        product.filter((item) => item.category === selectedCategory)
      );
    } else {
      setFilteredProducts(product); // Show all products if no category selected
    }
  }, [selectedCategory, product]);

  // Update `selectedCategory` when URL param changes
  useEffect(() => {
    setSelectedCategory(category || null);
  }, [category]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    navigate(`/category/${category}`);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    const existingCartItem = cart.find(
      (item) => item.product.id === product.id
    );
    setQuantity(existingCartItem ? existingCartItem.quantity : 1);
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
      // Show products for the selected category or all products
      setFilteredProducts(
        selectedCategory
          ? product.filter((item) => item.category === selectedCategory)
          : product
      );
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // First check if the search term matches a category
    const isCategorySearch = product.some(
      (item) => item.category.toLowerCase() === lowerCaseSearchTerm
    );

    if (isCategorySearch) {
      // Filter products by the matching category
      const filteredByCategory = product.filter(
        (item) => item.category.toLowerCase() === lowerCaseSearchTerm
      );
      setFilteredProducts(filteredByCategory);
      setSelectedCategory(lowerCaseSearchTerm); // Update the selectedCategory
      if (filteredByCategory.length === 0) {
        toast.error("No products found in this category!");
      }
    } else {
      // Otherwise, search for products by title or category
      const filteredByNameOrCategory = product.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.category.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredProducts(filteredByNameOrCategory);

      // Reset the breadcrumb and h4 to "All Products" when search doesn't match a category
      setSelectedCategory(null);

      if (filteredByNameOrCategory.length === 0) {
        toast.error("No products found for this search!");
      }
    }
  };

  const handleCartClick = () => {
    if (cartSectionRef.current) {
      cartSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar
        onSearch={handleSearch}
        cart={cart}
        handleCartClick={handleCartClick}
      />
      <section className="flex px-6 space-x-10 lg:space-x-20 lg:px-40">
        <div className="space-y-8">
          <p>More Categories</p>

          <ul className="list">
            {[...new Set(product.map((item) => item.category))].map(
              (category, index) => (
                <li
                  key={index}
                  className={`cursor-pointer ${
                    selectedCategory === category ? "font-bold" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="space-y-14 lg:space-y-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">All Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {selectedCategory || "All Products"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-16 md:pt-2">
            <h4>{selectedCategory ? selectedCategory : "All Products"}</h4>

            {loading ? (
              // Display Skeletons while loading
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:gap-20">
                {[...Array(5)].map((_, index) => (
                  <div className="flex flex-col space-y-3" key={index}>
                    <Skeleton className="h-[125px] w-[100px] md:w-[250px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px] md:w-[250px]" />
                      <Skeleton className="h-4 w-[100px] md:w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Display products once loaded
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                {filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="space-y-4 cursor-pointer"
                    onClick={() => handleProductClick(item)}
                  >
                    <img
                      alt={item.title}
                      src={item.image}
                      className="w-full h-40 transition shadow-xl md:h-56 object-fit rounded-xl"
                    />

                    <div className="flex flex-col gap-2">
                      <p>{item.title}</p>
                      <span>${item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
      </section>

      <div className="flex justify-end px-6 lg:px-40">
        <Cart
          cart={cart}
          updateCartItemQuantity={updateCartItemQuantity}
          removeCartItem={removeCartItem}
          clearCart={clearCart}
          ref={cartSectionRef}
        />
      </div>

      <ToastContainer />
    </>
  );
}

export default Main;
