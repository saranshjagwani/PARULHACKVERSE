import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";
const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]); // State for cart items
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    // Toggle the mobile menu
    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    // Logout function
    const logout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };
    // Fetch cart items from Firestore
    useEffect(() => {
        const cartRef = collection(fireDB, "cart");
        const unsubscribe = onSnapshot(cartRef, (querySnapshot) => {
            const cartArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCartItems(cartArray);
        });
        return () => unsubscribe();
    }, []);
    // Calculate the total cart count
    const cartCount = cartItems.length;
    return (<div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 dark:bg-gray-900">
      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-green-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over ₹300
        </p>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="text-2xl font-bold text-green-600 dark:text-green-400">
            EcoMove
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition">
              Home
            </Link>
            <a href="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/12/16/15/20241216153741-9IAFZ8D1.json" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition">
              AskAI
            </a>
            <Link to="/product" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition">
              Products
            </Link>
            <Link to="/" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition">
              Order
            </Link>
            {user?.user?.email === "sj1@gmail.com" && (<Link to="/dashboard" className="-m-2 block p-2 font-medium text-gray-900">
                Admin
              </Link>)}
            {user && (<a onClick={logout} className="-m-2 block p-2 font-medium text-gray-900 cursor-pointer">
                Logout
              </a>)}
            <Link to="/cart" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
              <ShoppingCart />
              <span className="text-sm font-medium">{cartCount}</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-green-600 dark:text-green-400" onClick={toggleMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={28}/> : <Menu size={28}/>}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (<div className="md:hidden flex flex-col gap-4 mt-4 bg-gray-50 dark:bg-gray-800 rounded-md p-4 shadow-lg">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
              Home
            </Link>
            <a href="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/12/16/15/20241216153741-9IAFZ8D1.json" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition">
              AskAI
            </a>
            <Link to="/product" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition">
              Products
            </Link>
            <Link to="/" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition">
              Order
            </Link>
            {user?.user?.email === "sj1@gmail.com" && (<Link to="/dashboard" className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition">
                Admin
              </Link>)}
            {user && (<a onClick={logout} className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition cursor-pointer">
                Logout
              </a>)}
            <Link to="/cart" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
              <ShoppingCart />
              <span className="text-sm font-medium">{cartCount}</span>
            </Link>
          </div>)}
      </div>
    </div>);
};
export default Navbar;
