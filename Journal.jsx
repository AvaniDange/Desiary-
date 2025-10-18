import React from 'react'

function Journal() {
  return (
    <>
      <div className='w-full px-8 flex flex-wrap gap-6 mt-8 justify-center'>
        <JournalCard title="Dreams" color="bg-[#FF8B9C]"/>
        <JournalCard title="Wishes" color="bg-[#FFD180]"/>
        <JournalCard title="Goals" color="bg-[#80FF91]"/>
        <JournalCard title="Travel Bucket List" color="bg-[#809CFF]"/>
        <JournalCard title="Memories" color="bg-[#FF8B9C]"/>
      </div>
      <div className="fixed size-16 bg-[#FF69AA] rounded-full flex items-center justify-center bottom-10 right-10 cursor-pointer shadow-lg hover:-translate-y-2 duration-300 z-10">
        <p className="text-4xl font-semibold font-prata">+</p>
      </div>
    </>
    
  )
}

function JournalCard({title,color}){
  return (
    <div className={`w-80 h-80 rounded-lg ${color} flex items-center justify-center cursor-pointer`}>
      <p className='text-2xl font-prata'>{title}</p>
    </div>
  )
}

export default Journal
