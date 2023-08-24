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
import { useProductStore } from "../store";
import Search from "./Search";
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
  const { filteredProducts } = useProductStore();
  // const isUserLoggedIn = useCallback(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser({ email: user.email, uid: user.uid });
  //       getProducts(setProducts);
  //     } else {
  //       return router.push("/");
  //     }
  //   });
  // }, [router]);

  // useEffect(() => {
  //   isUserLoggedIn();
  // }, [isUserLoggedIn]);

  // if (!user?.email) return <Loading />;

  const toggleAdd = () => {
    setOpenAddModal(!openAddModal);
  };
  const toggleEdit = () => {
    setOpenEditModal(!openEditModal);
  };
  useEffect(() => {
    getProducts(setProducts);
  }, []);
  return (
    <main className="flex w-full min-h-[100vh] relative">
      <SideNav />

      <div className="md:w-[85%] w-full py-4 px-6 min-h-[100vh] bg-[#f4f4f6]">
        <Header title="Products" />
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
        <div className="w-full mb-10 flex justify-between">
          <button
            className="py-2 px-4 bg-green-500 text-white rounded"
            onClick={() => {
              setOpenAddModal(true);
            }}
          >
            Add Product{" "}
          </button>
          <Search products={products} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length !== 0
                ? filteredProducts?.map((product: Product) => (
                    <tr key={product.id} className="text-sm text-gray-500">
                      <td className="px-6 py-4 md:py-2 whitespace-nowrap">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 md:py-2 whitespace-nowrap">{`R${product.price.toLocaleString()}`}</td>
                      <td className="px-6 py-4 md:py-2 whitespace-nowrap">{`${product?.quantity?.toLocaleString()}`}</td>
                      <td className="px-6 py-4 md:py-2 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 md:py-2 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <MdDeleteForever
                            className="text-red-500 cursor-pointer"
                            onClick={() =>
                              deleteProduct(product.id, product.name)
                            }
                          />
                          <MdOutlineModeEdit
                            className="text-blue-500 cursor-pointer"
                            onClick={() => {
                              setProduct(product);
                              toggleEdit();
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                : products?.map((product: Product) => (
                    <tr key={product.id} className="text-sm text-gray-500">
                      <td className="px-6 py-4 md:py-2 whitespace-nowrap">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 md:py-2 whitespace-nowrap">{`R${product.price.toLocaleString()}`}</td>
                      <td className="px-6 py-4 md:py-2 whitespace-nowrap">{`${product?.quantity?.toLocaleString()}`}</td>
                      <td className="px-6 py-4 md:py-2 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="px-6  whitespace-nowrap">
                        <div className="flex justify-between">
                          <MdDeleteForever
                            className="text-red-500 cursor-pointer"
                            onClick={() =>
                              deleteProduct(product.id, product.name)
                            }
                          />
                          <MdOutlineModeEdit
                            className="text-blue-500 cursor-pointer"
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
