import { useState } from "react";
import Logo from "../../assets/Logo.png";
import { Input } from "../ui/input";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

const Navbar: React.FC<SearchProps> = ({ onSearch }) => {
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
      <nav className="flex items-center gap-4 justify-between px-6 lg:px-40">
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

        <div className="flex flex-col md:flex md:flex-row items-center gap-2">
          <div className="flex items-center justify-center border border-[#2E3A6E] bg-[#2E3A6E] text-white rounded-full p-2 w-10 h-10">
            JK
          </div>
          <p className="text-center">John Kennedy</p>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
