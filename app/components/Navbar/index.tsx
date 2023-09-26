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
    if (pathname !== "/register" && pathname !== "/login") {
      if (!uid) {
        router.push("/");
      }
    }
    if (pathname == "/register" || pathname == "/login" || pathname == "/") {
      if (uid && user.role == "owner") {
        router.push("/dashboard");
      }
      if (uid && user.role == "teller") {
        router.push("/till");
      }
    }
    console.log(user,"aye");
    
  }, [pathname, uid, user]);

  return <div></div>;
};
export default Navbar;
