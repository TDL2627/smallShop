"use client";
import { SignUpUser } from "@/utils";
import React, { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [store, setStore] = useState("");
  const [role, setRole] = useState<any>("teller"); // Set a default role
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    SignUpUser(email, password, store, name, role, router);
  };

  return (
    <main className="w-full h-[90vh] flex items-center justify-center flex-col px-4">
      <h2 className="text-3xl font-bold mb-6">Register</h2>
      <form className="flex flex-col md:w-1/2 w-full mb-8" onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="border-[1px] py-2 px-4 rounded mb-4"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />

        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          className="border-[1px] py-2 px-4 rounded mb-4"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email..."
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          className="border-[1px] py-2 px-4 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password..."
        />

        <label htmlFor="store">Store Name</label>
        <input
          type="text"
          name="store"
          id="store"
          className="border-[1px] py-2 px-4 rounded mb-4"
          required
          value={store}
          onChange={(e) => setStore(e.target.value)}
          placeholder="My Store"
        />

        <label htmlFor="role">User Role</label>
        <select
          name="role"
          id="role"
          className="border-[1px] py-2 px-4 rounded mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="teller">Teller</option>
          <option value="owner">Owner</option>
        </select>

        <button
          type="submit"
          className="p-3 bg-blue-600 hover:bg-blue-800 text-white md:w-[200px] w-full rounded"
        >
          SIGN UP
        </button>
      </form>
      <Link className="text-black text-center text-sm underline" href="/login">
        Login
      </Link>
      <p className="text-gray-400 text-center text-sm">
        &copy; Copyright {new Date().getFullYear()} by TDL2627
      </p>
    </main>
  );
}