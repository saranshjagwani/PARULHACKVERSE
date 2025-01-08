import React, { useContext, useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy, doc, setDoc, updateDoc, deleteDoc, } from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";
import myContext from "@/Context/data/MyContext";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
const ProductCard = () => {
    const context = useContext(myContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState({});
    if (!context) {
        throw new Error("ProductCard must be used within a Provider.");
    }
    const fetchProducts = () => {
        setLoading(true);
        const productQuery = query(collection(fireDB, "products"), orderBy("time", "desc"));
        const unsubscribe = onSnapshot(productQuery, (querySnapshot) => {
            const productsArray = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setProducts(productsArray);
            setLoading(false);
        });
        return () => unsubscribe();
    };
    const fetchCart = () => {
        const cartRef = collection(fireDB, "cart");
        const unsubscribe = onSnapshot(cartRef, (querySnapshot) => {
            const cartData = {};
            querySnapshot.forEach((doc) => {
                cartData[doc.id] = doc.data();
            });
            setCart(cartData);
        });
        return () => unsubscribe();
    };
    const addToCart = async (product) => {
        try {
            const cartRef = doc(fireDB, "cart", product.id);
            if (cart[product.id]) {
                await updateDoc(cartRef, { quantity: cart[product.id].quantity + 1 });
            }
            else {
                await setDoc(cartRef, {
                    id: product.id,
                    title: product.title || "Unknown Title",
                    price: product.price || 0,
                    quantity: 1,
                    imageUrl: product.imageUrl || "",
                    alternativefor: product.alternativefor || "Uncategorized",
                    orderStatus: false,
                });
            }
        }
        catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add product to cart. Please try again.");
        }
    };
    const incrementQuantity = async (productId) => {
        try {
            if (cart[productId]) {
                const cartRef = doc(fireDB, "cart", productId);
                await updateDoc(cartRef, { quantity: cart[productId].quantity + 1 });
            }
        }
        catch (error) {
            console.error("Error incrementing quantity:", error);
        }
    };
    const decrementQuantity = async (productId) => {
        try {
            if (cart[productId]?.quantity > 1) {
                const cartRef = doc(fireDB, "cart", productId);
                await updateDoc(cartRef, { quantity: cart[productId].quantity - 1 });
            }
            else if (cart[productId]) {
                await deleteDoc(doc(fireDB, "cart", productId));
            }
        }
        catch (error) {
            console.error("Error decrementing quantity:", error);
        }
    };
    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);
    return (<section className="text-gray-600 body-font bg-green-50 py-8">
      <div className="container px-5 py-8 md:py-16 mx-auto">
        <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2">
            Our Sustainable Collection
          </h1>
        </div>

        {loading ? (<div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>) : (<div className="flex flex-wrap -m-4">
            {products.map((product) => (<div className="h-full border-2 border-gray-200 border-opacity-60 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-green-300 transition-shadow duration-300 ease-in-out">
                  <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-green-300 transition-shadow duration-300 ease-in-out">
                    <div className="flex justify-center">
                    <Link key={product.id} to={`/product/${product.id}`} className="flex justify-center cursor-pointer">
                      <img className="rounded-xl w-full h-80 p-2 hover:scale-105 transition-transform duration-300 ease-in-out" src={product.imageUrl ||
                    "https://via.placeholder.com/400x300?text=Eco+Product"} alt={product.title || "Eco-friendly Product"}/>
                         </Link>
                    </div>
                    <div className="p-5 border-t-2">
                      <h2 className="tracking-widest text-xs title-font font-medium mb-1 text-green-600">
                        {product.alternativefor || "EcoMove"}
                      </h2>
                      <h1 className="title-font text-lg font-medium mb-3">
                        {product.title || "Sustainable Product Title"}
                      </h1>
                      <p className="leading-relaxed mb-3">
                        ₹{product.price || "500"}
                      </p>
                      <div className="flex justify-between items-center">
                        {cart[product.id] ? (<div className="flex items-center space-x-3">
                            <MinusCircle className="w-6 h-6 text-green-600 cursor-pointer" onClick={() => decrementQuantity(product.id)}/>
                            <span className="text-lg font-bold">
                              {cart[product.id].quantity}
                            </span>
                            <PlusCircle className="w-6 h-6 text-green-600 cursor-pointer" onClick={() => incrementQuantity(product.id)}/>
                          </div>) : (<button type="button" onClick={() => addToCart(product)} className="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm py-2 px-4 transition-all">
                            Add to Cart
                          </button>)}
                      </div>
                    </div>
                  </div>
                </div>))}
          </div>)}
      </div>
    </section>);
};
export default ProductCard;
