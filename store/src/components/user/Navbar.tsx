import { useState } from "react";
import Logo from "../../assets/Logo.png";
import { Input } from "../ui/input";
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
import { Product } from "./Main";

interface CartItem {
  product: Product;
  quantity: number;
}

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  cart: CartItem[];
  handleCartClick: () => void;
}

const Navbar: React.FC<SearchProps> = ({ onSearch, cart, handleCartClick }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchTerm); // Trigger the search when "Enter" is pressed
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between gap-4 px-6 lg:px-40">
        <div>
          <img src={Logo} alt="Logo" />
        </div>

        <div className="w-[280px] lg:w-[550px]">
          <Input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Add keydown event listener here
            placeholder="Search product categories..."
            className="w-full p-2 rounded-3xl"
          />
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
    </>
  );
};

export default Navbar;
