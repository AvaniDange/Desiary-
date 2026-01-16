import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

function JournalCanvas() {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
console.log(journal?.elements[1]?.src);
  useEffect(() => {
    const fetchJournal = async () => {
      const journalRef = doc(db, 'journals', id);
      const journalSnap = await getDoc(journalRef);
      if (journalSnap.exists()) {
        setJournal(journalSnap.data());
      } else {
        console.log('No such document!');
      }
    };
    fetchJournal();
  }, [id]);

  if (!journal) return <div>Loading...</div>;

  return (
    <div className="canvas-container w-full h-[90vh] flex flex-col items-center mt-10 p-4 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6">{journal.title}</h2>
      <div className="text-lg bg-white  h-full p-6 rounded-lg shadow-md w-full relative"> 
        <div className="relative h-full w-full">
          {/* Render Elements */}
          {journal.elements.map((element) => {
            if (element.type === 'text') {
              return (
                <div
                  key={element.id}
                  style={{
                    position: 'absolute',
                    top: `${element.y}px`,
                    left: `${element.x}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    fontSize: '18px', // Adjust text size as needed
                  }}
                >
                  {element.text}
                </div>
              );
            }
            if (element.type === 'image') {
              return (
                <img
                  key={element.id}
                  src={element.src}
                  style={{
                    position: 'absolute',
                    top: `${element.y}px`,
                    left: `${element.x}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    // objectFit:'contain'
                  }}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default JournalCanvas;
