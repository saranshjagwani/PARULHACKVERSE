import React, { useState, useEffect } from 'react'; // Add useState and useEffect here
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '@/firebase/FirebaseConfig';
import Navbar from '@/components/ui/Navbar';

const ProductInfo: React.FC = () => {
  const { id } = useParams(); // Get the dynamic 'id' from the URL
  const [product, setProduct] = useState<any>(null); // Store product data

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Check if id exists in the URL
        if (id) {
          const productRef = doc(fireDB, 'products', id); // Fetch product by id
          const productSnapshot = await getDoc(productRef);
          
          if (productSnapshot.exists()) {
            setProduct(productSnapshot.data()); // Set the product data to the state
          } else {
            console.log('Product not found');
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]); // Dependency on 'id' to refetch when 'id' changes

  if (!product) {
    return <div>Loading...</div>; // Loading state
  }
  const renderStars = (rating: number) => {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;
  }
  return (
    <div>
      <Navbar/>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-32 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src={product.imageUrl}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {product.alternativefor}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.title}
              </h1>
              <div className="flex mb-4">
                <span className="flex items-center">
                  {renderStars(product.EnvRating)} {/* EnvRating stars */}
                  <span className="text-gray-600 ml-3">{product.EnvRating} Env Rating</span>
                </span>
              </div>
              <div className="flex mb-4">
                <span className="flex items-center">
                  {renderStars(product.HealthRating)} {/* HealthRating stars */}
                  <span className="text-gray-600 ml-3">{product.HealthRating} Health Rating</span>
                </span>
              </div>
              <p className="leading-relaxed border-b-2 mb-5 pb-5">
                {product.description}
              </p>
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">
                  ₹{product.price}
                </span>
                <button className="flex ml-auto text-white bg-green-700 border-0 py-2 px-6 focus:outline-none hover:bg-green-800 rounded">
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductInfo;
