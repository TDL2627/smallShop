import { useState, useEffect } from "react";
import { useProductStore } from "../store";
const Search = (props: any) => {
  const { products } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const { setFilteredProducts } = useProductStore();
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  let arr: any = [];
  useEffect(() => {
    if (products) {
      arr = products.filter(
        (product: any) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (arr) {
      setFilteredProducts(arr);
    }
  }, [searchTerm]);
  return (
    <>
      <div>
        <input
          className="outline-none border border-black rounded-sm "
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </>
  );
};
export default Search;
