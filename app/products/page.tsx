"use client";
import SideNav from "../dashboard/SideNav";
import { MdDeleteForever, MdOutlineModeEdit } from "react-icons/md";
import Header from "../dashboard/Header";
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
import {
  addProduct,
  deleteProduct,
  getCategories,
  getProducts,
  User,
  Item,
} from "@/utils";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

interface Product {
  id: string;
  category: string;
  price: number;
  quantity: number;
  name: string;
}

export default function Home() {
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [product, setProduct] = useState<any>(null);

  const isUserLoggedIn = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email, uid: user.uid });
        getProducts(setProducts);
      } else {
        return router.push("/");
      }
    });
  }, [router]);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

  if (!user?.email) return <Loading />;

  const toggleAdd = () => {
    setOpenAddModal(!openAddModal);
  };
  const toggleEdit = () => {
    setOpenEditModal(!openEditModal);
  };
  return (
    <main className="flex w-full min-h-[100vh] relative">
      <SideNav />

      <div className="md:w-[85%] w-full py-4 px-6 min-h-[100vh] bg-[#f4f4f6]">
        <Header title="Products" />

        <section className="w-full mb-10">
          <button
            className="py-2 px-4 bg-green-500 text-white rounded"
            onClick={() => {
              setOpenAddModal(true);
            }}
          >
            Add Product{" "}
          </button>
          {openAddModal && (
            <>
              <AddProduct toggle={toggleAdd} />
            </>
          )}
          {openEditModal && (
            <>
              <EditProduct toggle={toggleEdit} product={product} />
            </>
          )}
        </section>

        <div className="w-full">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product: Product) => (
                <tr key={product.id} className="text-sm text-gray-500">
                  <td>{product.name}</td>
                  <td>{`R${product.price.toLocaleString()}`}</td>
                  <td>{`${product?.quantity?.toLocaleString()}`}</td>
                  <td>{product.category}</td>
                  <td>
                    <div className="flex w-full justify-between">
                      <MdDeleteForever
                        className="text-3xl text-red-500 cursor-pointer"
                        onClick={() => deleteProduct(product.id, product.name)}
                      />
                      <MdOutlineModeEdit
                        className="text-3xl text-blue-500 cursor-pointer"
                        onClick={() => {
                          setProduct(product);
                          toggleEdit();
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
