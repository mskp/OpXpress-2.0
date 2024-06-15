import { ChangeEvent } from "react";
import { Input } from "../ui/input";

type SearchBarProps = {
  searchTerm: string;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function SearchBar({ searchTerm, handleSearchChange }: SearchBarProps) {
  return (
    <Input
      className="border-none focus:ring-0 rounded-full text-black bg-white w-full relative z-50"
      placeholder="Search for products..."
      type="search"
      value={searchTerm}
      onChange={handleSearchChange}
    />
  );
}

export default SearchBar;
