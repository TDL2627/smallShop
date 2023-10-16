"use client";
import Header from "../dashboard/Header";
import SideNav from "../dashboard/SideNav";

export default function Home() {
  return (
    <main className="flex w-full min-h-[100vh] relative">
      <SideNav />

      <div className="md:w-[85%] w-full py-4 px-6 min-h-[100vh] bg-[#f4f4f6]">
        <Header title="Categories" />
      </div>
    </main>
  );
}
