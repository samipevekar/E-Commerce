import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { app } from '../../firebase';
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from 'react-redux';
import { createGoogleUserAsync } from '../auth/authSlice';


export default function GoogleAuth() {

  const auth = getAuth(app)

  const dispatch = useDispatch()


    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            const resultsFormGoogle = await signInWithPopup(auth, provider)
            dispatch(createGoogleUserAsync({
                name: resultsFormGoogle.user.displayName,
                email: resultsFormGoogle.user.email
            }))
        } catch (error) {
            console.error(error)
        }

    }


    return (
        <div>
            <button onClick={handleGoogleClick} className='w-full flex justify-center items-center gap-3 text-black border-2 border-black mt-4 py-1.5 font-semibold text-sm rounded-md '> <FcGoogle className=' text-xl' /> Login With Google</button>
        </div>
    )
}