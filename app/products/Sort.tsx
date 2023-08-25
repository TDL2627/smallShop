import { useState, useEffect } from "react";
import { useProductStore } from "../store";
const Sort = () => {
  const [sortBy, setSortBy] = useState("name"); // Default sorting by name
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const { setProducts, products } = useProductStore();

  const handleSortChange = (event: any) => {
    const { value } = event.target;
    setSortBy(value);
  };

  const handleOrderChange = (event: any) => {
    const { value } = event.target;
    setSortOrder(value);
  };
  let arr: any = [];
  useEffect(() => {
    if (products) {
      arr = [...products].sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "price") {
          return (
            (parseFloat(a.price) - parseFloat(b.price)) *
            (sortOrder === "asc" ? 1 : -1)
          );
        }
        return 0;
      });
    }
    if (arr) {
      setProducts(arr);
    }
  }, [sortBy, sortOrder]);
  return (
    <>
      <div className="mb-4 flex items-center">
        <label htmlFor="sort" className="mr-2">
          Sort by:
        </label>
        <select
          id="sort"
          className="px-2 py-1 border rounded"
          onChange={handleSortChange}
          value={sortBy}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>
      <div className="mb-4 flex items-center">
        <label htmlFor="order" className="mr-2">
          Order:
        </label>
        <select
          id="order"
          className="px-2 py-1 border rounded"
          onChange={handleOrderChange}
          value={sortOrder}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </>
  );
};
export default Sort;
