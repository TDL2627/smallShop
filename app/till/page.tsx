"use client";
import React, { FormEventHandler, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProducts, LogOut } from "@/utils";
import { useProductStore } from "../store";
export default function Till() {
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState<any>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashPaid, setCashPaid] = useState<any>(0);
  const [searchInput, setSearchInput] = useState("");
  const { products, setProducts } = useProductStore();
  const [readyCheckout, setReadyCheckout] = useState(false);
  useEffect(() => {
    getProducts(setProducts);
  }, []);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const availableProducts = products.filter(
    (product: any) => product.quantity >= 1
  );

  const handleAddToCart = (product: any) => {
    setCart([...cart, { selectedQuantity: 1, ...product }]);
  };

  const handleRemoveFromCart = (product: any) => {
    const updatedCart = cart.filter((item: any) => item.id !== product.id);
    setCart(updatedCart);
  };

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
  };

  const handleCashPaidChange = (e: any) => {
    if (e.target.value == "") {
      setCashPaid("");
    } else {
      setCashPaid(parseFloat(e.target.value));
    }
  };

  const calculateChange = () => {
    return Number(cashPaid) - total;
  };

  const handleCheckout = () => {
    // Implement your payment processing logic here
    console.log("Processing payment...");
    console.log("Selected payment method:", paymentMethod);
    console.log("Total amount:", total);

    if (paymentMethod === "cash") {
      console.log("Cash Paid:", Number(cashPaid).toFixed(2));
      console.log("Change:", calculateChange().toFixed(2));
    }

    console.log("Cart items:", cart);
  };
  const handleSearchInputChange = (e: any) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchInput(searchTerm);

    const filteredResults = availableProducts.filter((product: any) =>
      product.name.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filteredResults);
  };
  const handleQuantityChange = (product: any, newQuantity: any) => {
    const updatedCart = cart.map((item: any) => {
      if (item.id === product.id) {
        return { ...item, selectedQuantity: parseInt(newQuantity, 10) };
      }
      return item;
    });

    setCart(updatedCart);
  };

  useEffect(() => {
    if (searchInput == "") {
      setFilteredProducts(null);
    }
  }, [searchInput]);

  useEffect(() => {
    // Recalculate the total based on the updated quantities
    const newTotal = cart.reduce(
      (acc: any, item: any) => acc + item.price * item.selectedQuantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);
  const router = useRouter();
  useEffect(() => {
    console.log(cashPaid, " cash");
    console.log(total, " cash tot");
    console.log(cart, " cash cart");
    if (
      cashPaid !== 0 &&
      typeof cashPaid !== 'string' &&
      cart.length > 0 &&
      cashPaid >= total
    ) {
      setReadyCheckout(false);
    } else {
      setReadyCheckout(true);
    }
  }, [cashPaid, total, cart]);
  return (
    <div className="bg-gray-100 min-h-screen overflow-y-scroll pb-10">
      <h2 className="text-5xl font-bold text-center py-8">Till</h2>
      <Link
        href="/"
        className="text-red-500 fixed top-2 right-2"
        onClick={() => LogOut(router)}
      >
        Log out
      </Link>

      <div className="container mx-auto grid lg:grid-cols-2 gap-4 px-4 pt-10">
        <div className="lg:block sticky top-10">
          <h3 className="text-xl font-semibold mb-2">Product Search:</h3>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <ul>
            {filteredProducts &&
              filteredProducts.map((product: any) => (
                <li
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
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
              <option value="card">Card</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Cart:</h3>
            <ul>
              {cart.map((product: any) => (
                <li key={product.id} className="flex justify-between mb-2">
                  <div>
                    <span>{product.name}</span>
                    <span className="ml-4">
                      R{Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <select
                      value={product.selectedQuantity}
                      onChange={(e) =>
                        handleQuantityChange(product, e.target.value)
                      }
                      className="border border-gray-300 rounded p-2 w-16"
                    >
                      {}
                      {(() => {
                        const options = [];
                        for (let i = 1; i <= product.quantity; i++) {
                          options.push(
                            <option key={i} value={i}>
                              {i}
                            </option>
                          );
                        }
                        return options;
                      })()}
                    </select>
                    <button
                      onClick={() => handleRemoveFromCart(product)}
                      className="text-red-600 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

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

          <div className="mb-4">
            <p className="text-xl font-semibold mb-2">
              Total: R{total.toFixed(2)}
            </p>
            {cashPaid !== 0 && !isNaN(cashPaid) && (
              <p className="text-xl font-semibold mb-2">
                Change: R{calculateChange().toFixed(2)}
              </p>
            )}
            <button
              onClick={handleCheckout}
              disabled={readyCheckout}
              className={` ${
                !readyCheckout ? "bg-green-500" : " bg-gray-500"
              } text-white px-4 py-2 rounded `}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
