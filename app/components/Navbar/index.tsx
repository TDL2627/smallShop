"use client";
import { getUser } from "@/utils";
import React, { FormEventHandler, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    console.log(pathname, "Aye path");
  }, [pathname]);

  return <div>nav</div>;
};
export default Navbar;
