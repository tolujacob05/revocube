import { useState } from "react";
import rect1 from "../../assets/rect1.png";
import rect2 from "../../assets/rect2.png";
import { Input } from "../ui/input";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
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
    <div className="relative flex flex-col items-center justify-center border-[#2E3A6E] bg-[#2E3A6E] rounded-3xl z-10 h-[350px]">
      <div className="absolute bottom-0 left-0 w-[120px] md:w-[150px]">
        <img src={rect1} alt="" className="rounded-3xl h-full w-full" />
      </div>

      <h2>
        Explore all the Food <br /> from our Cafeteria
      </h2>

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

      <div className="absolute top-0 right-0 w-[100px] md:w-[150px]">
        <img src={rect2} alt="" className="rounded-r-3xl h-full w-full" />
      </div>
    </div>
  );
};

export default Search;
