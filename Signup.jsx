import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  // Handle the form submission for sign-up
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setIsSigningUp(true);

      // Create the user with Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Save additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: user.email,
      });

      toast.success("Account created successfully!");
      navigate("/"); // Redirect after successful signup
    } catch (error) {
      toast.error(`Error during sign-up: ${error.message}`);
      console.error("Sign-up error:", error.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="h-[80vh] w-[80vw] max-w-[1300px] max-h-[900px] flex shadow-2xl rounded-[40px]">
        <div className="w-[100%] lg:w-[60%] h-full bg-gradient-to-tr from-[#F8B59A] to-[#FDE1EF] via-[#F27EA1] rounded-[40px] flex justify-center items-center lg:rounded-r-none">
          <div className="flex-col">
            <p className='text-5xl font-medium text-center tracking-tightiest'>Sign up</p>
            <p className='text-center font-medium text-lg text-[#3A3A3A]'>Start your journey with us</p>
            
            <form className='flex flex-col mt-7 gap-2' onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='text-lg py-4 px-5 rounded-xl outline-none'
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='text-lg py-4 px-5 rounded-xl outline-none'
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='text-lg py-4 px-5 rounded-xl outline-none'
              />
              <button 
                type="submit"
                className='mt-2 text-center min-w-full bg-[#F4F6F9] text-black py-4 rounded-xl hover:-translate-y-1 transition-all duration-300 hover:shadow-lg'
                disabled={isSigningUp}
              >
                {isSigningUp ? "Signing Up..." : "Sign up"}
              </button>
            </form>

            <Link to="/" className='text-end mt-1 text-sm'>
              <p className='text-center mt-3 text-sm text-white hover:underline'>Already have an Account?</p>
            </Link>

            {/* <button className='mt-2 text-center min-w-full bg-[#F4F6F9] text-black py-4 rounded-full hover:-translate-y-1 transition-all duration-300 hover:shadow-lg'>
              Signup using Google
            </button> */}
          </div>
        </div>
        <div className="lg:w-[40%] h-full bg-[#FFE8E8] rounded-r-[40px]"></div>
      </div>
    </div>
  );
}

export default Signup;
