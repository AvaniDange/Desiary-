import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db, storage } from "../config/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Make sure to import both uploadBytes and getDownloadURL
import { FaTimes } from "react-icons/fa"; // Import cross (delete) icon

function Memories() {
  const [imageFile, setImageFile] = useState(null); // State for the selected image file
  const [text, setText] = useState(""); // State for the text description
  const [user] = useAuthState(auth); // Get user details
  const [memories, setMemories] = useState([]); // State for storing memory images

  // Fetch memories for the logged-in user
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, "memories"), (querySnapshot) => {
        const memoriesList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userID === user.uid) {
            memoriesList.push({ id: doc.id, ...data });
          }
        });
        setMemories(memoriesList);
      });

      return () => unsubscribe(); // Cleanup on unmount
    }
  }, [user]);

  // Function to handle adding memory with image and text upload to Firestore
  const handleAddMemory = async () => {
    if (!imageFile && !text) return; // Prevent empty submissions
    
    // Ensure the file is an image before attempting to upload it
    if (imageFile && !imageFile.type.startsWith("image/")) {
      console.error("Please upload a valid image file.");
      return;
    }

    try {
      let downloadURL = null;

      // If an image is selected, upload it to Firebase Storage
      if (imageFile) {
        const storageRef = ref(storage, `memories/${user.uid}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile); // Upload image to Firebase Storage
        downloadURL = await getDownloadURL(storageRef); // Get the download URL of the uploaded image
      }

      // Add the memory to Firestore with image URL and text
      await addDoc(collection(db, "memories"), {
        imageUrl: downloadURL,
        text: text,
        userID: user?.uid,
        timestamp: new Date(),
      });

      setText(""); // Clear the text input after submitting
      setImageFile(null); // Clear the selected file after submitting
    } catch (error) {
      console.error("Error adding memory:", error);
    }
  };

  // Function to handle deleting a memory
  const handleDeleteMemory = async (memoryId, imageUrl) => {
    try {
      // Delete the memory document from Firestore
      await deleteDoc(doc(db, "memories", memoryId));

      // If there is an image, delete it from Firebase Storage
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef); // Delete the image from storage
      }

      console.log("Memory deleted successfully");
    } catch (error) {
      console.error("Error deleting memory:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center py-4 px-3">
        {/* Text input for memory description */}
        <input
          type="text"
          placeholder="Add a memory description..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-gray-300 h-full rounded-md px-3 py-2 w-1/2"
        />
        {/* File input for image uploads */}
        <input
          type="file"
          accept="image/*" // Allow only image files
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border border-gray-300 h-full rounded-md px-3 py-2 ml-2 w-1/2"
        />
        <button
          onClick={handleAddMemory}
          className="bg-fuchsia-400 text-white px-4 rounded-md ml-2 hover:bg-fuchsia-600 py-2"
        >
          Submit
        </button>
      </div>

      {/* Displaying the list of memories */}
      <div className="p-10">
        <h2 className="text-4xl font-bold mb-4 font-alexBrush">Your Memories</h2>
        <div className="w-full flex flex-wrap gap-2">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="flex flex-col border border-slate-300 max-w-[33%] gap-2 p-2 relative"
            >
              {memory.imageUrl && (
                <img
                  src={memory.imageUrl}
                  alt="Memory"
                  className="w-full h-full object-cover rounded-md"
                />
              )}
              <p className="text-lg mt-2">{memory.text}</p>
              <span className="text-gray-500 text-sm">
                {new Date(memory.timestamp.seconds * 1000).toLocaleString()}
              </span>

              {/* Cross button (delete option) at top-right corner */}
              <div className="absolute top-2 right-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleDeleteMemory(memory.id, memory.imageUrl)}
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Memories;
