import React, { useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'; // Correct import
import { fireDB } from '@/firebase/FirebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // New state for phone number
  const [isPhoneNumberDialogOpen, setIsPhoneNumberDialogOpen] = useState<boolean>(false); // New state for dialog

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const cartRef = collection(fireDB, 'cart');
        const snapshot = await getDocs(cartRef);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Failed to load cart items.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = () => {
    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    let shipping = subtotal >= 300 ? 0 : 120;
    let total = shipping + subtotal;
    return { subtotal, shipping, total };
  };

  const handleOrder = async () => {
    const { total } = calculateTotal();

    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    const orderDetails = {
      phoneNumber, // Store phone number instead of userId
      cartItems,
      total,
      date: new Date().toLocaleString(),
    };

    try {
      // Update each cart item's orderStatus to true
      for (const item of cartItems) {
        const cartItemRef = doc(fireDB, 'cart', item.id); // Use the cart item ID
        await updateDoc(cartItemRef, { orderStatus: true });
      }

      // Optionally, add order details to a new collection (like 'orders')
      await addDoc(collection(fireDB, 'orders'), orderDetails);

      toast.success('Order placed successfully!');
      setCartItems([]);
      localStorage.setItem('cart', JSON.stringify([]));
      setIsPhoneNumberDialogOpen(false); // Close the dialog after order
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order.');
    }
  };

  const { subtotal, shipping, total } = calculateTotal();

  return (
    <>
      <Navbar />
      <div className="h-screen bg-gray-100 flex mt-16 flex-col w-[1100px]">
        <div className="flex-grow pt-5 px-6 md:px-12 xl:px-24">
          <h1 className="text-center text-2xl font-bold mb-8">Cart Items</h1>
          {/* Cart items list */}
          <div className="w-full bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between mb-4">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-gray-700">₹{subtotal}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-gray-700">Shipping</p>
              <p className="text-gray-700">₹{shipping}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">₹{total}</p>
            </div>
            <button
              type="button"
              className="w-full bg-violet-600 py-2 text-center rounded-lg text-white font-bold"
              onClick={() => setIsPhoneNumberDialogOpen(true)} // Open the dialog
            >
              Tap To Confirm
            </button>
          </div>
        </div>
      </div>

      {/* Phone Number Dialog */}
      {isPhoneNumberDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Enter Your Phone Number</h2>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-white"
              placeholder="Phone Number"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setIsPhoneNumberDialogOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleOrder}
                className="bg-violet-600 text-white py-2 px-4 rounded-lg"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
