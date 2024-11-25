import { useEffect, useRef, useState, forwardRef } from "react";
import { Product } from "./Main";
import Lottie from "react-lottie-player";
import lottieJson from "@/assets/json/empty-state.json";
import { useLottieAnimation } from "@/lib/utils/lottie-animation";
import { Link } from "react-router-dom";
import Checkout from "./Checkout";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  updateCartItemQuantity: (productId: number, newQuantity: number) => void;
  removeCartItem: (productId: number) => void;
  clearCart: () => void;
}

// Use React.forwardRef to handle the passed ref
const Cart = forwardRef<HTMLDivElement, CartProps>(
  ({ cart, updateCartItemQuantity, removeCartItem, clearCart }, ref) => {
    const lottieRef = useRef(null);
    const { isPlaying, handleMouseEnter, handleMouseLeave } =
      useLottieAnimation(12000);
    const [showPopover, setShowPopover] = useState(false);

    // Pagination state
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    // Update cart in local storage
    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Handle checkout and clear the cart
    const handleCheckout = () => {
      clearCart(); // Clear the cart by calling the clearCart function passed from parent
      setShowPopover(true); // Show the popover
    };

    // Calculate the current page's items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = cart.slice(startIndex, startIndex + itemsPerPage);

    // Pagination controls
    const totalPages = Math.ceil(cart.length / itemsPerPage);

    const handlePrevPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
      <div
        ref={ref} // Attach the forwarded ref to the root div
        className="flex flex-col items-center p-6 mt-8 transition-all duration-300 bg-white border w-96 md:mt-0 rounded-xl"
        style={{
          minHeight: cart.length === 0 ? "200px" : "auto", // Fixed height when cart is empty
          maxHeight: "400px", // Maximum height to prevent overflow
          overflowY: cart.length > 0 ? "auto" : "auto", // Scroll if items exceed max height
        }}
      >
        <h4 className="mb-4 text-xl font-semibold">Your Order</h4>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center">
            <div
              className="flex flex-col items-center gap-1 p-5 text-center lg:mb-20"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Lottie
                loop={isPlaying}
                animationData={lottieJson}
                play={isPlaying}
                ref={lottieRef}
                className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"
              />
              <p className="text-gray-500">
                Your cart is empty. Add items to get started!
              </p>
            </div>
          </div>
        ) : (
          currentItems.map((cartItem) => (
            <div key={cartItem.product.id} className="w-full">
              <div className="flex justify-center mt-4 space-x-28">
                <div className="w-full">
                  <div className="flex gap-2">
                    <p>{cartItem.quantity}x</p>
                    <span>{cartItem.product.title}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-4 bg-gray-200 p-2 rounded-full w-[100px]">
                    {/* Decrease Quantity */}
                    <button
                      onClick={() =>
                        updateCartItemQuantity(
                          cartItem.product.id,
                          cartItem.quantity - 1
                        )
                      }
                      disabled={cartItem.quantity <= 1}
                    >
                      -
                    </button>
                    <p>{cartItem.quantity}</p>
                    {/* Increase Quantity */}
                    <button
                      onClick={() =>
                        updateCartItemQuantity(
                          cartItem.product.id,
                          cartItem.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <span>
                    ${(cartItem.product.price * cartItem.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeCartItem(cartItem.product.id)}
                    className="text-red-500 underline"
                  >
                    remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <div className="mt-4 border border-[#0A1853] bg-[#0A1853] p-4 rounded-full">
            <button onClick={handleCheckout} className="text-white">
              Checkout {cart.reduce((acc, item) => acc + item.quantity, 0)}{" "}
              items for $
              {cart
                .reduce(
                  (total, item) => total + item.product.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between w-full mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="text-blue-500 disabled:text-gray-300"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="text-blue-500 disabled:text-gray-300"
          >
            Next
          </button>
        </div>

        {/* Popover */}
        {showPopover && (
          <div className="fixed z-50 p-6 text-center transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg top-1/2 left-1/2">
            <div>
              <Checkout />
              <p className="mb-4 text-gray-700">
                Your order has been placed successfully!
              </p>
              <Link
                to="/"
                className="text-blue-500 underline hover:text-blue-700"
                onClick={() => setShowPopover(false)}
              >
                Go back to Homepage
              </Link>
            </div>
          </div>
        )}

        {/* Overlay for popover */}
        {showPopover && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setShowPopover(false)}
          ></div>
        )}
      </div>
    );
  }
);

export default Cart;
