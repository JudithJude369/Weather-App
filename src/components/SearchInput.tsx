import { useSearch } from "@/contexts/search-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import searchIcon from "@/assets/images/icon-search.svg";

const SearchInput = () => {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <section className="mt-12 flex flex-col  md:flex-row  md:items-stretch gap-2 justify-center ">
      <div className="relative w-full md:flex-1 max-w-2xl">
        <Input
          value={searchTerm}
          placeholder=" Search for a city, e.g., New York"
          className="cursor-pointer pl-12 w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src={searchIcon}
          alt=""
          className="logo absolute left-3 top-1/2 -translate-y-1/2"
        />
      </div>
      <Button className="bg-blue-700 cursor-pointer hover:bg-blue-500 px-8">
        Search
      </Button>
    </section>
  );
};

export default SearchInput;
