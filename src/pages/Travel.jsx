import React, { useEffect, useState } from 'react';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Ensure this package is installed or remove if unused

function Travel() {
  const [travelText, setTravelText] = useState('');
  const [wanttravelText, setWantTravelText] = useState('');
  const [user] = useAuthState(auth);
  const [travelEntries, setTravelEntries] = useState([]);
  const [wantTravelEntries, setWantTravelEntries] = useState([]);
  const [travleList, setTravleList] = useState([]); // Declare this if it is supposed to collect place names

  const navigate = useNavigate();
  const colors = ['#FFD3E1', '#B8D3FF', '#EEFFEC', '#FFE8E8', '#FFF1FB', '#EEFFEC', '#E1DEF8', '#D8F5ED'];
  const [colorIndex, setColorIndex] = useState(0);

  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  useEffect(() => {
    setTimeout(() => {
    generatePlaces()
  }, 2500);
}, [])

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'travel'), where('userID', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const entriesList = [];
        querySnapshot.forEach((doc) => {
          entriesList.push({ id: doc.id, ...doc.data() });
        });
        setTravelEntries(entriesList);
        setTravleList((prevList) => [...prevList, ...entriesList.map((e) => e.text)]);
      });

      const r = query(collection(db, 'wanttotravel'), where('userID', '==', user.uid));
      const unnsubscribe = onSnapshot(r, (querySnapshot) => {
        const entriesList = [];
        querySnapshot.forEach((doc) => {
          entriesList.push({ id: doc.id, ...doc.data() });
        });
        setWantTravelEntries(entriesList);
        setTravleList((prevList) => [...prevList, ...entriesList.map((e) => e.text)]);
      });

      return () => {
        unsubscribe();
        unnsubscribe();
      };
    }
  }, [user]);

  const getNextColor = () => {
    const color = colors[colorIndex];
    setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    return color;
  };

  const handleAddEntry = async () => {
    if (!travelText.trim()) return;
    try {
      await addDoc(collection(db, 'travel'), {
        text: travelText,
        userID: user?.uid,
        timestamp: new Date(),
        colors: getNextColor()
      });
      setTravelText('');
    } catch (error) {
      console.error('Error adding travel entry:', error);
    }
  };

  const handleWantAddEntry = async () => {
    if (!wanttravelText.trim()) return;
    try {
      await addDoc(collection(db, 'wanttotravel'), {
        text: wanttravelText,
        userID: user?.uid,
        timestamp: new Date(),
        colors: getNextColor()
      });
      setWantTravelText('');
    } catch (error) {
      console.error('Error adding travel entry:', error);
    }
  };

  const handleMarkAsVisited = async (placeId, placeText) => {
    try {
      await addDoc(collection(db, 'travel'), {
        text: placeText,
        userID: user?.uid,
        timestamp: new Date(),
        colors: getNextColor()
      });

      await deleteDoc(doc(db, 'wanttotravel', placeId));
    } catch (error) {
      console.error('Error marking as visited:', error);
    }
  };

  const generatePlaces = async () => {
    setAIResponse('');
    const prompt = `Recommend places different but which align with the ${travleList}. Just give 5 names of these places as a result with no description just their names`;
    setLoading(true);

    try {
      const result = await model.generateContent(prompt); // Ensure `model` is defined elsewhere or replace it with actual Google AI instance usage
      const response = await result.response;
      const text = await response.text();
      setAIResponse(text);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setAIResponse("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVisitedPlace = async (placeId) => {
    try {
      await deleteDoc(doc(db, 'travel', placeId));
    } catch (error) {
      console.error('Error deleting visited place:', error);
    }
  };

  return (
    <div className='w-full h-[93vh] flex flex-col overflow-x-clip'>
      <div className="p-8 w-full h-full flex-1 relative">
        <h2 className="text-4xl font-alexBrush font-bold mb-4">Your Travel List</h2>
        <div className="w-full flex">
          <div className="flex-1 flex-col flex h-[75vh] p-2">
            <div className="flex-1 flex flex-col">
              <h1 className='text-center font-prata font-bold text-3xl py-2'>Visited</h1>
              <div className="flex-1 flex justify-center items-center">
                <div className="flex flex-wrap p-4">
                  {travelEntries.map((box) => (
                    <div
                      className="rounded-md m-1 relative group flex items-center justify-center text-lg font-semibold"
                      style={{ background: box.colors, width: '100px', height: '50px' }}
                      key={box.id}
                    >
                      {box.text}
                      <button
                        onClick={() => handleDeleteVisitedPlace(box.id)}
                        className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center items-center">
              <input
                type="text"
                value={travelText}
                onChange={(e) => setTravelText(e.target.value)}
                placeholder="Add already visited places"
                className="border bg-slate-200 border-gray-300 rounded-md h-full px-3 py-2"
                onKeyDown={(key) => {
                  if (key.key === "Enter") {
                    handleAddEntry();
                  }
                }}
              />
              <button
                onClick={handleAddEntry}
                className="bg-fuchsia-400 text-white px-4 rounded-md ml-2 hover:bg-fuchsia-600 py-2"
              >
                Add
              </button>
            </div>
          </div>
          <div className="border border-black"></div>
          <div className="flex-1 h-[75vh] flex flex-col p-2">
            <div className="flex-1 flex flex-col">
              <h1 className='text-center font-prata font-bold text-3xl py-2'>Want to Visit</h1>
              <div className="flex-1 py-6 px-4">
                {wantTravelEntries.map((box) => (
                  <li className="text-lg flex items-center" key={box.id}>
                    <span className='flex-1'>{box.text}</span>
                    <button
                      onClick={() => handleMarkAsVisited(box.id, box.text)}
                      className="ml-2 text-green-500"
                    >
                      <FaCheck />
                    </button>
                  </li>
                ))}
              </div>
              <div className="p-2 bg-slate-200 my-4 rounded-xl ">
                {loading ? "Loading ..." : "Recommendations: "}
                {aiResponse}
              </div>
            </div>
            <div className="w-full flex justify-center items-center gap-2">
              <button className='bg-slate-100 rounded-xl px-2' onClick={() => { navigate('/home/user/itinerary') }}>Generate Itinerary</button>
              <input
                type="text"
                value={wanttravelText}
                onChange={(e) => setWantTravelText(e.target.value)}
                placeholder="Add places to visit"
                className="border bg-slate-200 border-gray-300 rounded-md h-full px-3 py-2 flex-1"
                onKeyDown={(key) => {
                  if (key.key === "Enter") {
                    handleWantAddEntry();
                  }
                }}
              />
              <button
                onClick={handleWantAddEntry}
                className="bg-fuchsia-400 text-white px-4 rounded-md ml-2 hover:bg-fuchsia-600 py-2"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Travel;
