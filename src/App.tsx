import "./App.css";
import Login from "./auth/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Signup from "./auth/Signup";
import MainTest from "./ecomovetest/MainTest";
import MainPage from "./sellpage/MainPage";
import Cart from "./sellpage/Cart";
import Dashboard from "./admin/dashboard/Dashboard";
import AddProduct from "./pages/AddProduct";
import { store } from "@/redux/Store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ProtectedRoutesForAdmin } from "./routes/routes";
import MyState from "@/Context/data/MyState";
import ProductInfo from "./sellpage/ProductInfo";
import SearchPage from "./sellpage/SearchPage";



function App() {
  return (
    <Provider store={store}>
      <MyState>
        <Router>
          <Routes>
            <Route path="/" element={<MainTest />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product" element={<MainPage/>} />
            <Route path="/productdetails" element={<ProductInfo/>} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoutesForAdmin>
                  <Dashboard />
                </ProtectedRoutesForAdmin>
              }
            />
            <Route
              path="/addproduct"
              element={
                <ProtectedRoutesForAdmin>
                  <AddProduct />
                </ProtectedRoutesForAdmin>
              }
              />
               <Route
              path="/addproduct"
              element={
                
                  <AddProduct />
              }
              />
              <Route path="/product/:id" element={<ProductInfo />} />
              <Route path="/searchpage" element={<SearchPage />} />
          </Routes>
        </Router>
        <ToastContainer />
      </MyState>
    </Provider>
  );
}

export default App;

