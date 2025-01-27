import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { resetCartAsync } from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../features/auth/authSlice";
import { resetOrder } from "../features/order/orderSlice";

function OrderSuccessPage() {
   const params = useParams() 
   const dispatch = useDispatch();
   
   useEffect(()=>{
    // reset cart
    dispatch(resetCartAsync())
    // reset currentOrder
    dispatch(resetOrder())
   },[dispatch])
   
  return (
    <div className="">
    {!params.id &&  <Navigate to='/' replace={true}></Navigate>}
    <main className="grid h-[100vh] place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-green-600">Order Successfully Placed</p>
        <h1 className="mt-4 text-2xl  text-red-700 font-bold tracking-tight  sm:text-5xl">
          <span className="text-black">Order Number</span> #{params?.id}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          You can check your order in My Account {">"} My Orders
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 "
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
    </div>
  );
}

export default OrderSuccessPage;