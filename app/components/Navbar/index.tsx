"use client";
import { getUser } from "@/utils";
import React, { FormEventHandler, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  useEffect(() => {
    getUser();
  }, []);

  return <div>nav</div>;
};
export default Navbar;
