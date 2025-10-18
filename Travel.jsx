import React, { useEffect, useState } from 'react';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';

function Travel() {
  const [travelText, setTravelText] = useState(''); // State for input value
  const [user] = useAuthState(auth); // Get user details
  const [travelEntries, setTravelEntries] = useState([]); // State for storing travel entries

  // Fetch travel entries for the logged-in user
  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'travel'), where('userID', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const entriesList = [];
        querySnapshot.forEach((doc) => {
          entriesList.push({ id: doc.id, ...doc.data() });
        });
        setTravelEntries(entriesList);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [user]);

  // Function to handle adding travel entry to Firestore
  const handleAddEntry = async () => {
    if (!travelText.trim()) return; // Prevent empty submissions
    try {
      await addDoc(collection(db, 'travel'), {
        text: travelText,
        userID: user?.uid,
        timestamp: new Date(),
      });
      setTravelText(''); // Clear input after submitting
    } catch (error) {
      console.error('Error adding travel entry:', error);
    }
  };

  return (
    <div className='w-full h-[93vh] flex flex-col'>
    <div className="p-8 w-full h-full flex-1 relative">
      <h2 className="text-4xl font-alexBrush font-bold mb-4">Your TravelList</h2>
      <ul className="list-disc pl-5">
        {travelEntries.map((item) => (
          <li key={item.id} className="mb-2 text-lg">
            {item.text} <span className="text-gray-500 text-sm font-sans">{new Date(item.timestamp.seconds * 1000).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <div className="fixed bottom-6 w-full flex justify-center items-center">
        <input
          type="text"
          value={travelText}
          onChange={(e) => setTravelText(e.target.value)}
          placeholder="Add to your wishlist..."
          className="border bg-slate-200 border-gray-300 rounded-md h-full px-3 py-2 w-1/2 "
          onKeyDown={(key)=>{
            if (key.key==="Enter") {
              handleAddEntry()
          }}}
        />
        <button
          onClick={handleAddEntry}
          className="bg-fuchsia-400 text-white px-4 rounded-md ml-2 hover:bg-fuchsia-600 py-2"
        >
          Add
        </button>
      </div>
    </div>
  </div>
  );
}

export default Travel;
