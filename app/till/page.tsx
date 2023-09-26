"use client";
import React, { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Till() {
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState<any>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashPaid, setCashPaid] = useState(0);

  const handleAddToCart = (product: any) => {
    setCart([...cart, product]);
    setTotal(total + product.price);
  };

  const handleRemoveFromCart = (product: any) => {
    const updatedCart = cart.filter((item: any) => item.id !== product.id);
    setCart(updatedCart);
    setTotal(total - product.price);
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

  return (
    <>
      <h2 className="w-full text-5xl font-bold text-center">Till</h2>
      <div className="w-full flex">
        <div>{/* select products and display products here */}</div>
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
              {cart.map((product) => (
                <li key={product.id} className="flex justify-between mb-2">
                  <span>{product.name}</span>
                  <span>${product.price.toFixed(2)}</span>
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
