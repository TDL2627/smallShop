import Link from "next/link";
export default function Home() {
  return (
    <>
      <div className="w-full h-screen grid justify-center items-center">
        <h1 className="font-black text-5xl lg:text-7xl">Small Shop</h1>
        <div className="mt-4 grid  gap-4 lg:flex w-full lg:justify-between  items-center justify-center">
          <Link href="/login">
            <p className="bg-blue-500 w-[200px] text-center  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
              Login
            </p>
          </Link>
          <Link href="/register">
            <p className="bg-green-500 w-[200px] text-center hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Register
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
