import { Button } from "./ui/button";
import { Input } from "./ui/input";
import searchIcon from "@/assets/images/icon-search.svg";

const SearchInput = () => {
  return (
    <section className="mt-12 ">
      <div className="relative ">
        <Input
          value=""
          placeholder=" Search for a city, e.g., New York"
          className="cursor-pointer pl-12"
        />
        <img src={searchIcon} alt="" className="logo absolute top-2 left-2 " />
      </div>
      <Button className="bg-blue-700 cursor-pointer hover:bg-blue-500">
        Search
      </Button>
    </section>
  );
};

export default SearchInput;
