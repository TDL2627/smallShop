"use client";
import { AiFillCloseCircle } from "react-icons/ai";
import React, {
  FormEventHandler,
  useState,
  useCallback,
  useEffect,
} from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loading from "../dashboard/Loading";
import { addProduct, User, Item, editProduct } from "@/utils";
import { categories } from "../categories/type";

const EditProduct = (payload: any) => {
  const { toggle, product } = payload;
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const [price, setPrice] = useState<string>(product.price);
  const [quantity, setQuantity] = useState<any>(product.quantity);
  const [title, setTitle] = useState<string>(product.name);

  const [category, setCategory] = useState<string>(product.category);

  const isUserLoggedIn = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email, uid: user.uid });
      } else {
        return router.push("/");
      }
    });
  }, [router]);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

  if (!user?.email) return <Loading />;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    editProduct(title, price, category, quantity, product.id);
    toggle();
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };
  const handleStock = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(value);
  };

  return (
    <>
      <div className=" w-full md:p-auto p-4 h-full dim absolute top-0 left-0 z-40 flex items-center justify-center">
        <div className="bg-white md:w-2/3 w-full p-6 rounded-lg shadow-lg overflow-y-auto">
          <AiFillCloseCircle
            className="text-3xl cursor-pointer text-[#D64979] place-self-end float-right"
            onClick={() => {
              toggle();
            }}
          />

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col text-start items-center  justify-between  mb-4">
              <h2 className="text-3xl font-bold mb-4">Edit Product</h2>
              <p className="w-full md:text-center">Name</p>
              <input
                className="border-[1px] p-2 md:w-1/3 w-full mb-4 rounded"
                type="text"
                placeholder="Name"
                name="product"
                id="product"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="w-full md:text-center">Price</p>

              <input
                className="border-[1px] p-2 md:w-1/3 w-full mb-4 rounded"
                type="text"
                placeholder="Price"
                name="price"
                id="price"
                required
                value={price}
                onChange={handlePrice}
              />
              <p className="w-full md:text-center">Quantity</p>

              <input
                className="border-[1px] p-2 md:w-1/3 w-full mb-4 rounded"
                type="number"
                placeholder="Stock"
                name="stock"
                id="stock"
                required
                value={quantity.toString()}
                onChange={handleStock}
              />
              <p className="w-full md:text-center">Type</p>

              <select
                name="category"
                className="border-[1px] p-2 md:w-1/3 w-full mb-4 rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="any">Select Category</option>
                {categories.map((item: string) => (
                  <option value={`${item}`} >{item}</option>
                ))}
              </select>
              <button className="py-2 px-4 bg-green-500 text-white rounded md:w-1/3 w-full ">
                EDIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default EditProduct;
