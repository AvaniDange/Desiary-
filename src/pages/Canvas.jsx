import React, { useEffect, useState } from "react";
import { collection, addDoc, doc, onSnapshot, updateDoc, query, where } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const CanvaLikeInterface = () => {
  const [user] = useAuthState(auth);
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [currentJournalId, setCurrentJournalId] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);

  // Fetch saved journal entries for the logged-in user
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "journals"), where("userID", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJournalEntries(entries);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Save a new journal entry
  const saveJournalEntry = async () => {
    if (!journalEntry.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "journals"), {
        title: journalEntry,
        userID: user.uid,
        createdAt: new Date(),
      });
      setCurrentJournalId(docRef.id);
      setJournalEntry(""); // Clear input
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  // Add text element
  const addTextElement = () => {
    if (!currentJournalId) return; // Only proceed if a journal is selected
    const newElement = {
      id: Date.now(),
      type: "text",
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      text: "Edit Me",
    };
    setElements([...elements, newElement]);
    saveElementToJournal(newElement);
  };

  // Add image element from uploaded file
  const addImageElement = (file) => {
    if (!currentJournalId) return; // Only proceed if a journal is selected
    const reader = new FileReader();
    reader.onload = () => {
      const newElement = {
        id: Date.now(),
        type: "image",
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        src: reader.result,
      };
      setElements([...elements, newElement]);
      saveElementToJournal(newElement);
    };
    reader.readAsDataURL(file);
  };

  // Save element to Firestore within the current journal entry
  const saveElementToJournal = async (element) => {
    try {
      const journalRef = doc(db, "journals", currentJournalId);
      await updateDoc(journalRef, {
        elements: [...elements, element], // Save all elements within the entry
      });
    } catch (error) {
      console.error("Error saving element to journal:", error);
    }
  };

  // Update element's position, size, or content
  const updateElement = (id, newProps) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
    saveElementToJournal(elements.map((el) => (el.id === id ? { ...el, ...newProps } : el)));
  };

  // Delete the selected element
  const deleteSelectedElement = () => {
    if (selectedElementId) {
      setElements(elements.filter((el) => el.id !== selectedElementId));
      saveElementToJournal(elements.filter((el) => el.id !== selectedElementId));
      setSelectedElementId(null);
    }
  };

  return (
    <div className="flex h-screen font-sans w-screen overflow-hidden">
      {/* Toolbar */}
      <div className="w-1/5 bg-gray-100 p-4 border-r border-gray-200">
        {/* Journal Entry Section */}
        <div>
          <input
            type="text"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Journal Entry Title"
            className="my-2 w-full px-2 py-1 border rounded"
          />
          <button
            onClick={saveJournalEntry}
            className="bg-purple-600 text-white font-semibold py-2 mb-4 px-4 rounded-md hover:bg-purple-700 transition-colors w-full"
          >
            Save Journal Entry
          </button>
        </div>

        {/* Toolbar Buttons */}
        <h3 className="text-lg font-semibold mb-4">Toolbar</h3>
        <button
          className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={addTextElement}
          disabled={!currentJournalId} // Disable if no journal is selected
        >
          Add Text
        </button>
        <label className="w-full mb-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer inline-block text-center">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => addImageElement(e.target.files[0])}
            className="hidden"
            disabled={!currentJournalId} // Disable if no journal is selected
          />
        </label>

        {/* Layer Selection and Delete Option */}
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Layers</h4>
          <ul className="space-y-1">
            {elements.map((el) => (
              <li
                key={el.id}
                onClick={() => setSelectedElementId(el.id)}
                className={`p-2 cursor-pointer rounded ${
                  selectedElementId === el.id ? "bg-blue-300" : "bg-gray-200"
                }`}
              >
                {el.type === "text" ? el.text : "Image Layer"}
              </li>
            ))}
          </ul>
          <button
            className="mt-3 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={deleteSelectedElement}
          >
            Delete Selected Layer
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 bg-gray-50">
        {elements.map((el) => (
          <DraggableElement
            key={el.id}
            element={el}
            updateElement={updateElement}
            isSelected={el.id === selectedElementId}
          />
        ))}
      </div>
    </div>
  );
};

const DraggableElement = ({ element, updateElement, isSelected }) => {
  const handleDrag = (e, data) => {
    updateElement(element.id, { x: data.x, y: data.y });
  };

  const handleResize = (e, { size }) => {
    e.stopPropagation();
    updateElement(element.id, { width: size.width, height: size.height });
  };

  return (
    <Draggable position={{ x: element.x, y: element.y }} onDrag={handleDrag} handle=".draggable-handle">
      <div className="relative">
        <ResizableBox
          width={element.width}
          height={element.height}
          onResizeStop={handleResize}
          minConstraints={[50, 30]}
          resizeHandles={["se"]}
          className={`border ${isSelected ? "border-blue-500" : "border-dashed border-gray-400"} bg-white p-2`}
        >
          <div className=" draggable-handle w-full h-full flex items-center justify-center">
            {element.type === "text" ? (
              <input
                type="text"
                value={element.text}
                onChange={(e) => updateElement(element.id, { text: e.target.value })}
                className="text-center w-full bg-transparent focus:outline-none"
              />
            ) : (
              <img
                src={element.src}
                alt="uploaded"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain', // Ensure the image maintains its aspect ratio
                }}
              />
            )}
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
};


export default CanvaLikeInterface;
