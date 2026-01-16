import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function Journal() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'journals'), where('userID', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const journalData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJournals(journalData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="w-full px-8 flex flex-wrap gap-6 mt-8 justify-center">
      {journals.map((journal) => (
        <JournalCard
          key={journal.id}
          title={journal.title}
          color="bg-[#FFD180]"
          onClick={() => navigate(`/home/user/canvas/${journal.id}`)}
        />
      ))}
      <div
        onClick={() => navigate('/home/user/canvas')}
        className="fixed size-16 bg-[#FF69AA] rounded-full flex items-center justify-center bottom-10 right-10 cursor-pointer shadow-lg hover:-translate-y-2 duration-300 z-10"
      >
        <p className="text-4xl font-semibold font-prata">+</p>
      </div>
    </div>
  );
}

function JournalCard({ title, color, onClick }) {
  return (
    <div
      className={`w-80 h-80 rounded-lg ${color} flex items-center justify-center cursor-pointer`}
      onClick={onClick}
    >
      <p className="text-2xl font-prata">{title}</p>
    </div>
  );
}

export default Journal;
