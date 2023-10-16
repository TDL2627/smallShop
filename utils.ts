import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import {
  doc,
  deleteDoc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
  Timestamp,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import db from "./firebase";

export interface Items {
  [key: string]: any;
  name: string;
  quantity: string;
  price: string;
  amount: string;
}
export interface Item {
  name: string;
  id: string;
  number_of_products: number;
}
export interface User {
  email: string | null;
  uid: string | null;
}
export interface Product {
  id: string;
  category: string;
  price: number;
  quantity: string;
  name: string;
}
export interface ProductItem {
  price: number;
  amount: string;
  quantity: string;
  name: string;
}
export interface Sales {
  customerEmail: string;
  customerName: string;
  id: string;
  totalAmount: number;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  products: ProductItem[];
}

export function calculateTotalAmount(objectsArray: Items[]) {
  let totalAmount = 0;

  for (let i = 0; i < objectsArray.length; i++) {
    const stringAmount = objectsArray[i].amount;
    const amount = Number(stringAmount.replace(/,/g, ""));
    totalAmount += amount;
  }

  return totalAmount;
}

export const successMessage = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
export const errorMessage = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const LoginUser = async (
  email: string,
  password: string,
  router: AppRouterInstance
) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user, "aye");
      const uid: any = auth?.currentUser?.uid;

      localStorage.setItem("userId", uid);

      successMessage("Authentication successful 🎉");
      const docRef = doc(db, "users", `${uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().role == "owner") {
          router.push("/dashboard");
        } else {
          router.push("/till");
        }
      }
    })
    .catch((error) => {
      console.error(error);
      errorMessage("Incorrect Email/Password ❌");
    });
};
export const getUser = async (setUser: any) => {
  console.log(auth, "aye autg");
  const uid =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  if (uid) {
    const docRef = doc(db, "users", `${uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }
};
export const SignUpUser = (
  email: string,
  password: string,
  store: string,
  name: string,
  role: string, // User role (e.g., "admin", "user")
  router: AppRouterInstance
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;

      // Create a user document in Firestore with the provided user role
      setDoc(doc(db, "users", `${uid}`), {
        email,
        name,
        store,
        role,
      })
        .then(() => {
          console.log(`User document created for ${email} with role ${role}`);
          localStorage.setItem("userId", uid);

          successMessage("Registration successful 🎉");
          if (role == "owner") {
            router.push("/dashboard");
          } else {
            router.push("/till");
          }
        })
        .catch((error) => {
          console.error("Error creating user document:", error);
          errorMessage("Registration failed ❌");
        });
    })
    .catch((error) => {
      console.log(error);
      if (error.code == "auth/email-already-in-use") {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;
            successMessage("Already signed up...");
            localStorage.setItem("userId", uid);

            setDoc(doc(db, "users", `${uid}`), {
              email,
              name,
              store,
              role,
            });
            if (role == "owner") {
              router.push("/dashboard");
            } else {
              router.push("/till");
            }
          })
          .catch((error) => {
            console.error("Error creating user document:", error);
          });
      } else {
        errorMessage("Registration failed ❌");
      }
    });
};
export const LogOut = (router: AppRouterInstance) => {
  signOut(auth)
    .then(() => {
      successMessage("Logout successful! 🎉");
      localStorage.clear();
      router.push("/");
    })
    .catch((error) => {
      errorMessage("Couldn't sign out ❌");
    });
};


// Create a store and add a product to it
export const addProduct = async (
  productName: string,
  price: string,
  category: string,
  quantity: number
) => {
  try {
    const storeRef = doc(db, "stores", "0000001");
    const storeProductsRef: any = collection(storeRef, "products");

    const productData = {
      name: productName,
      price,
      category,
      quantity,
    };

    await setDoc(storeProductsRef, productData);
    successMessage(`${productName} product added to store! 🎉`);
  } catch (err) {
    errorMessage("Error! ❌");
    console.error(err);
  }
};

// Edit a product within a store
export const editProduct = async (
  productId: string,
  productName: string,
  price: string,
  category: string,
  quantity: number
) => {
  try {
    const storeRef = doc(db, "stores", "0000001");
    const productRef = doc(storeRef, "products", productId);

    const productData = {
      name: productName,
      price,
      category,
      quantity,
    };

    await setDoc(productRef, productData);
    successMessage(`${productName} product edited! 🎉`);
  } catch (err) {
    errorMessage("Error editing product! ❌");
    console.error(err);
  }
};

// Get products from a store
export const getProducts = async (setProducts: any) => {
  try {
    const storeRef = doc(db, "stores", "0000001");
    const storeProductsRef = collection(storeRef, "products");

    const querySnapshot = await getDocs(storeProductsRef);
    const docs: any = [];
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });
    setProducts(docs);
  } catch (err) {
    console.error(err);
    setProducts([]);
  }
};

// Delete a product from a store
export const deleteProduct = async (
  productId: string,
  productName: string
) => {
  try {
    const storeRef = doc(db, "stores", "0000001");
    const productRef = doc(storeRef, "products", productId);

    await deleteDoc(productRef);
    successMessage(`${productName} deleted from store 🎉`);
  } catch (err) {
    errorMessage("Encountered an error ❌");
    console.error(err);
  }
};

export const addSales = async (
  customerName: string,
  customerEmail: string,
  products: Items[],
  totalAmount: number,
  setAddNew: any
) => {
  try {
    await addDoc(collection(db, "sales"), {
      customerName,
      customerEmail,
      products,
      totalAmount,
      timestamp: serverTimestamp(),
    });
    successMessage("Sales recorded! 🎉");
    setAddNew(false);
  } catch (err) {
    console.error(err);
    errorMessage("Error! Try again ❌");
  }
};

export const getSales = async (setSales: any) => {
  try {
    const docRef = collection(db, "sales");
    const q = query(docRef, orderBy("timestamp"));
    onSnapshot(q, (snapshot) => {
      const docs: any = [];
      snapshot.forEach((d: any) => {
        docs.unshift({ ...d.data(), id: d.id });
      });
      setSales(docs);
    });
  } catch (err) {
    console.error(err);
    setSales([]);
  }
};

export const getTotalSales = async (setTotalSales: any) => {
  try {
    const unsub = onSnapshot(collection(db, "sales"), (doc) => {
      let totalSales: number = 0;
      doc.forEach((d: any) => {
        totalSales += d.data().totalAmount;
      });
      setTotalSales(totalSales);
    });
  } catch (err) {
    console.error(err);
  }
};

export const getSalesForDay = async (date: Date | null, setSales: any) => {
  try {
    const day = date?.getDate();
    const month = date?.getMonth();
    const year: number | undefined = date?.getFullYear();

    if (day !== undefined && month !== undefined && year !== undefined) {
      const startDate = new Date(year, month, day, 0, 0, 0);
      const endDate = new Date(year, month, day, 23, 59, 59);

      const docRef = collection(db, "sales");
      const q = query(
        docRef,
        orderBy("timestamp"),
        where("timestamp", ">=", Timestamp.fromDate(startDate)),
        where("timestamp", "<=", Timestamp.fromDate(endDate))
      );

      onSnapshot(q, (snapshot) => {
        const docs: any = [];
        snapshot.forEach((d: any) => {
          docs.unshift({ ...d.data(), id: d.id });
        });
        setSales(docs);
      });
    }
  } catch (err) {
    console.error(err);
  }
};
