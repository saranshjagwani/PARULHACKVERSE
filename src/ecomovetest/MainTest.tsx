import React, { useContext } from "react";
import ObjectDetection from "@/ecomovetest/ObjectDetection";
import Navbar from "@/components/ui/Navbar";
import IntroVideo from "@/ecomovetest/IntroVideo";
import Footer from "./Footer";
import myContext from "@/Context/data/myContext";
import ProductShowcase from "./ProductShowcase";

const MainTest: React.FC = () => {
  const context = useContext(myContext);

  // Handle null context (when not wrapped with a provider)
  if (!context) {
    return (
      <p>
        Error: Context not found. Please wrap your component with the Provider.
      </p>
    );
  }

  // Destructure the context values
  // const { name, class: className } = context;

  return (
    <div>
      {/* Navbar Section */}
      <Navbar />

      {/* Main Content 
      <div>
        <h1>Name: {name}</h1>
        <h2>Class: {className}</h2>
        <ObjectDetection />
      </div>
*/}
      <div>
        <ObjectDetection />
      </div>
      {/* Product Showcase Section */}
      <IntroVideo />
      <div>
        <ProductShowcase/>
      </div>

      {/* Footer Section */}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default MainTest;
