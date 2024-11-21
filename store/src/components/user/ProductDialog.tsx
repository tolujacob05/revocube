import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "./Main";
import { toast } from "react-toastify";

type ProductDialogProps = {
  product: Product | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  cart: { product: Product; quantity: number }[];
  setCart: React.Dispatch<
    React.SetStateAction<{ product: Product; quantity: number }[]>
  >;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
};

const ProductDialog = ({
  product,
  isDialogOpen,
  setIsDialogOpen,
  setCart,
  quantity,
  setQuantity,
}: ProductDialogProps) => {
  const addToCart = () => {
    if (product) {
      setCart((prevCart) => {
        const existingCartItem = prevCart.find(
          (item) => item.product.id === product.id
        );
        if (existingCartItem) {
          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity } : item
          );
        }
        return [...prevCart, { product, quantity }];
      });
      toast.success(`${product.title} added to cart!`);
      setIsDialogOpen(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        {product && (
          <>
            <DialogHeader>
              <DialogTitle>{product.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="flex flex-col items-center">
              <div className="h-full">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-56 transition shadow-xl object-fit rounded-xl"
                />
              </div>
              <span className="self-start mt-2">${product.price}</span>
              <p className="mt-4">{product.description}</p>

              {/* Product Quantity Counter */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 bg-gray-200 rounded-full"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="p-2 bg-gray-200 rounded-full"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={addToCart}
                  className="mt-4 bg-[#0A1853] text-white py-2 px-4 rounded-full"
                >
                  Add {quantity} for ${(product.price * quantity).toFixed(2)}
                </button>
              </div>
            </DialogDescription>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
