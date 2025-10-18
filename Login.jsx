import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider, db } from "../config/firebase-config";
import React, { useState } from "react";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  // Handle email/password login
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      setIsSigningIn(true); // Start sign-in process
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = collection(db, "users");
      const userQuery = query(userRef, where("uid", "==", user.uid));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.docs.length > 0) {
        const userData = userSnapshot.docs[0].data();
        console.log("User exists in Firestore:", userData); // Log existing user
      } else {
        // If new user, create the user in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
        });
        console.log("New user created in Firestore.");
        toast.success(`Welcome, ${user.email}!`);
      }

      // Navigate to the home page after login
      navigate("/home");
    } catch (error) {
      toast.error(`Error during login: ${error.message}`);
      console.error("Error during email/password login:", error.message);
    } finally {
      setIsSigningIn(false); // Reset sign-in state
    }
  };

  // Handle Google login
  const handleGoogleSignIn = async () => {
    if (isSigningIn) return; // Prevent multiple popups

    try {
      setIsSigningIn(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = collection(db, "users");
      const userQuery = query(userRef, where("uid", "==", user.uid));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.docs.length > 0) {
        const userData = userSnapshot.docs[0].data();
        console.log("User exists in Firestore:", userData);
      } else {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        console.log("New user created in Firestore.");
        toast.success(`Welcome, ${user.displayName}!`);
      }

      navigate("/home"); // Navigate to home after Google login
    } catch (error) {
      toast.error(`Error during Google sign-in: ${error.message}`);
      console.error("Error during Google sign-in:", error.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="h-[80vh] w-[80vw] max-w-[1300px] max-h-[900px] flex shadow-2xl rounded-[40px]">
        <div className="lg:w-[60%] rounded-r-[40px] lg:rounded-r-none w-full h-full bg-gradient-to-tr from-[#F8B59A] to-[#FDE1EF] via-[#F27EA1] rounded-l-[40px] flex justify-center items-center">
          <div className="flex-col">
            <p className="text-5xl font-medium text-center tracking-tightiest">
              Log-in
            </p>
            <p className="text-center font-medium text-lg text-[#3A3A3A]">
              Where have you been?
            </p>
            
            {/* Email and Password Form */}
            <form className="flex flex-col mt-7 gap-2" onSubmit={handleEmailPasswordLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-lg py-4 px-5 rounded-xl outline-none"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-lg py-4 px-5 rounded-xl outline-none"
                required
              />
              <button
                type="submit"
                className="mt-2 text-center min-w-full bg-[#F4F6F9] text-black py-4 rounded-xl hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
                disabled={isSigningIn}
              >
                {isSigningIn ? "Signing in..." : "Log In with Email"}
              </button>
            </form>

            <Link to="/signup" className=" mt-1 text-sm">
              <p className="text-center mt-3 text-sm text-white hover:underline">
                Don't have an Account?
              </p>
            </Link>

            {/* Google Sign-In Button */}
            {/* <button
              onClick={handleGoogleSignIn}
              className={`mt-2 text-center min-w-full bg-[#F4F6F9] text-black py-4 rounded-full hover:-translate-y-1 transition-all duration-300 hover:shadow-lg ${
                isSigningIn ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSigningIn}
            >
              {isSigningIn ? "Signing in..." : "Login using Google"}
            </button> */}
          </div>
        </div>
        <div className="w-[40%] hidden lg:flex h-full bg-[#FFE8E8] rounded-r-[40px]"></div>
      </div>
    </div>
  );
};

export default Login;
