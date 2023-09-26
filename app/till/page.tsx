"use client";
import React, { FormEventHandler, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/utils";
import { useProductStore } from "../store";
export default function Till() {
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState<any>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashPaid, setCashPaid] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const { products, setProducts } = useProductStore();
  useEffect(() => {
    getProducts(setProducts);
  }, []);
  const [filteredProducts, setFilteredProducts] = useState(products);
  console.log(products, "aye pra");

  const handleAddToCart = (product: any) => {
    setCart([...cart, product]);
    setTotal(total + Number(product.price));
  };

  const handleRemoveFromCart = (product: any) => {
    const updatedCart = cart.filter((item: any) => item.id !== product.id);
    setCart(updatedCart);
    setTotal(total - Number(product.price));
  };

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
  };

  const handleCashPaidChange = (e: any) => {
    setCashPaid(parseFloat(e.target.value));
  };

  const calculateChange = () => {
    return cashPaid - total;
  };

  const handleCheckout = () => {
    // Implement your payment processing logic here
    console.log("Processing payment...");
    console.log("Selected payment method:", paymentMethod);
    console.log("Total amount:", total);

    if (paymentMethod === "cash") {
      console.log("Cash Paid:", cashPaid.toFixed(2));
      console.log("Change:", calculateChange().toFixed(2));
    }

    console.log("Cart items:", cart);
  };
  const handleSearchInputChange = (e: any) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchInput(searchTerm);

    const filteredResults = products.filter((product: any) =>
      product.name.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filteredResults);
  };

  return (
    <>
      <h2 className="w-full text-5xl font-bold text-center">Till</h2>
      <div className="w-full grid grid-cols-2 gap-4 px-4 pt-10">
        <div>
          <h3 className="text-xl font-semibold mb-2">Product Search:</h3>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <ul>
            {filteredProducts.map((product: any) => (
              <li
                key={product.id}
                onClick={() => handleAddToCart(product)} // Add product to cart when clicked
                className="cursor-pointer hover:bg-gray-100 p-2"
              >
                {product.name} - R{Number(product.price).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Payment Method:</label>
            <select
              className="border border-gray-300 rounded p-2 w-full"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <option value="credit_card">Credit Card</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Cart:</h3>
            <ul>
              {cart.map((product: any) => (
                <li key={product.id} className="flex justify-between mb-2">
                  <span>{product.name}</span>
                  <span>R{Number(product.price).toFixed(2)}</span>
                  <button
                    onClick={() => handleRemoveFromCart(product)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {paymentMethod === "cash" && (
            <div className="mb-4">
              <label className="block text-gray-700">Cash Paid:</label>
              <input
                type="number"
                step="0.01"
                className="border border-gray-300 rounded p-2 w-full"
                value={cashPaid}
                onChange={handleCashPaidChange}
              />
            </div>
          )}
          <div className="mb-4">
            <p className="text-xl font-semibold mb-2">
              Total: R{total.toFixed(2)}
            </p>
            {paymentMethod === "cash" && (
              <p className="text-xl font-semibold mb-2">
                Change: R{calculateChange().toFixed(2)}
              </p>
            )}
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
