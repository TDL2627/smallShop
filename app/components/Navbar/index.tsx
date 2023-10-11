"use client";
import { getUser } from "@/utils";
import React, { FormEventHandler, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/app/store";
const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, user } = useUserStore();
  const uid =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (user == null) {
      getUser(setUser);
    }
  }, []);
  useEffect(() => {
    if (pathname === "/register" || pathname === "/login") {
      return; // No redirection needed for these routes
    }

    if (!uid) {
      router.push("/");
    } else {
      if (user) {
        if (user.role === "owner") {
          router.push("/dashboard");
        } else if (user.role === "teller") {
          router.push("/till");
        }
      }
    }

    console.log(user, "aye");
  }, [pathname, uid, user]);

  return <div></div>;
};
export default Navbar;
