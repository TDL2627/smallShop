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

export const LoginUser = (
  email: string,
  password: string,
  router: AppRouterInstance
) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user, "aye");

      successMessage("Authentication successful 🎉");

      router.push("/dashboard");
    })
    .catch((error) => {
      console.error(error);
      errorMessage("Incorrect Email/Password ❌");
    });
};
export const getUser = async (setUser: any) => {
  console.log(auth, "aye autg");
  if (auth) {
    const uid: any = auth?.currentUser?.uid;
    const docRef = doc(db, "users", `${uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("aye data:", docSnap.data());
      setUser(docSnap.data())
      localStorage.setItem('userId', uid);

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
          successMessage("Registration successful 🎉");
          router.push("/dashboard");
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
            setDoc(doc(db, "users", `${uid}`), {
              email,
              name,
              store,
              role,
            });
            router.push("/dashboard");
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
      router.push("/");
    })
    .catch((error) => {
      errorMessage("Couldn't sign out ❌");
    });
};

export const getCategories = async (setCategories: any) => {
  try {
    const unsub = onSnapshot(collection(db, "categories"), (doc) => {
      const docs: any = [];
      doc.forEach((d: any) => {
        docs.push({ ...d.data(), id: d.id });
      });
      setCategories(docs);
    });
  } catch (err) {
    console.error(err);
    setCategories([]);
  }
};

export const deleteCategory = async (id: string, name: string) => {
  try {
    await deleteDoc(doc(db, "categories", id));
    const q = query(collection(db, "products"), where("category", "==", name));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((document) => {
        deleteDoc(doc(db, "products", document.id));
      });
    });
    successMessage(`${name} category deleted 🎉`);
  } catch (err) {
    errorMessage("Encountered an error ❌");
    console.log(err);
  }
};

export const addCategory = async (name: string) => {
  try {
    await addDoc(collection(db, "categories"), {
      name,
    });
    successMessage(`${name} category added! 🎉`);
  } catch (err) {
    errorMessage("Error! ❌");
    console.error(err);
  }
};

export const addProduct = async (
  name: string,
  price: string,
  category: string,
  quantity: number
) => {
  try {
    await addDoc(collection(db, "products"), {
      name,
      price,
      category,
      quantity,
    });
    successMessage(`${name} product added! 🎉`);
  } catch (err) {
    errorMessage("Error! ❌");
    console.error(err);
  }
};
export const editProduct = async (
  name: string,
  price: string,
  category: string,
  quantity: number,
  productId: string // Assuming productId is of type string
) => {
  try {
    const productRef = doc(db, "products", productId); // Reference to the specific product document
    await updateDoc(productRef, {
      name,
      price,
      category,
      quantity,
    });
    successMessage(`${name} product edited! 🎉`);
  } catch (err) {
    errorMessage("Error editing product! ❌");
    console.error(err);
  }
};

export const getProducts = async (setProducts: any) => {
  try {
    const unsub = onSnapshot(collection(db, "products"), (doc) => {
      const docs: any = [];
      doc.forEach((d: any) => {
        docs.unshift({ ...d.data(), id: d.id });
      });
      setProducts(docs);
    });
  } catch (err) {
    console.error(err);
    setProducts([]);
  }
};

export const deleteProduct = async (id: string, name: string) => {
  try {
    await deleteDoc(doc(db, "products", id));
    successMessage(`${name} deleted 🎉`);
  } catch (err) {
    errorMessage("Encountered an error ❌");
    console.log(err);
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
