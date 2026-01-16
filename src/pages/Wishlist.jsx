import React, { useEffect, useState } from 'react';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Square, SquareCheck, Trash } from 'lucide-react';

function Wishlist() {
  const [itemText, setItemText] = useState(''); // State for input value
  const [user] = useAuthState(auth); // Get user details
  const [wishlist, setWishlist] = useState([]); // State for storing wishlist items

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'wishlist'), where('userID', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const wishlistItems = [];
        querySnapshot.forEach((doc) => {
          wishlistItems.push({ id: doc.id, ...doc.data() });
        });
        setWishlist(wishlistItems);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [user]);

  // Function to handle adding item to Firestore
  const handleAddItem = async () => {
    if (!itemText.trim()) return; // Prevent empty submissions
    try {
      await addDoc(collection(db, 'wishlist'), {
        text: itemText,
        userID: user?.uid,
        isDone: false,
        timestamp: new Date(),
      });
      setItemText(''); // Clear input after submitting
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    }
  };

  // Function to mark an item as done (irreversible)
  const markAsDone = async (itemId, currentStatus) => {
    try {
      const itemRef = doc(db, 'wishlist', itemId);
      await updateDoc(itemRef, { isDone: !currentStatus });

      // Optimistically update local state to reflect changes immediately
      setWishlist((prevWishlist) =>
        prevWishlist.map((item) =>
          item.id === itemId ? { ...item, isDone: !currentStatus } : item
        )
      );
    } catch (error) {
      console.error('Error marking item as done:', error);
    }
  };

  // Function to delete an item
  const handleDelete = async (itemId) => {
    try {
      const itemRef = doc(db, 'wishlist', itemId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className='w-full h-[93vh] flex flex-col'>
      <div className="p-8 w-full h-full flex-1 relative">
        <div className='w-full flex justify-between'>
          <div className=' w-[60%]'>
            <h2 className="text-4xl font-alexBrush font-bold mb-4">Your Wishlist</h2>
            <ul className="pl-5">
              {wishlist.map((item) => (
                <div key={item.id} className="w-[70%] flex items-center justify-around">
                  <div onClick={() => markAsDone(item.id, item.isDone)} className="cursor-pointer">
                    {item.isDone ? (
                      <SquareCheck className="mb-2 mr-2 text-green-500" />
                    ) : (
                      <Square className="mb-2 mr-2" />
                    )}
                  </div>
                  <li
                    className={`mb-2 text-xl flex-1 cursor-pointer ${
                      item.isDone ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {item.text}
                  </li>
                  <div onClick={() => handleDelete(item.id)} className="cursor-pointer">
                    <Trash className="hover:text-red-600 mb-2" />
                  </div>
                </div>
              ))}
            </ul>
          </div>
          <div className='w-[40%] relative '>
            <img src="/scuba.jpeg" className='w-[17vw] rounded-lg absolute right-3 ' alt="" />
            <img src="/skiing.jpg" className='w-[18vw] rounded-lg absolute top-40 left-0 ' alt="" />
            <img src="/bungee.jpg" className='w-[18vw] rounded-lg absolute top-80 right-0' alt="" />
          </div>
        </div>
        <div className="fixed bottom-6 w-full flex justify-center items-center">
          <input
            type="text"
            value={itemText}
            onChange={(e) => setItemText(e.target.value)}
            placeholder="Add to your wishlist..."
            className=" ring ring-purple-200 focus:ring-2 focus:ring-purple-700 rounded-md h-full px-3 py-2 w-1/2 "
            onKeyDown={(key) => {
              if (key.key === 'Enter') {
                handleAddItem();
              }
            }}
          />
          <button
            onClick={handleAddItem}
            className="bg-fuchsia-400 text-white px-4 rounded-md ml-2 hover:bg-fuchsia-600 py-2"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
