import { useState } from 'react';

const Index = (
  { startDate, endDate, setStartDate, setEndDate }: { startDate: Date, endDate: Date, setStartDate: Function, setEndDate: Function }
) => {

  return (
    <div className='flex space-x-2 w-full items-center'>
      <input className="px-10 py-4 h-fit w-fit rounded-full text-xs border-white text-[#201F31] text-center" type="date" id="startDate" value={startDate.toISOString().split('T')[0]} onChange={(e) => setStartDate(new Date(e.target.value))} />
      <p> - </p>
      <input className="px-10 py-4 h-fit w-fit rounded-full text-xs border-white text-[#201F31] text-center" type="date" id="endDate" value={endDate.toISOString().split('T')[0]} onChange={(e) => setEndDate(new Date(e.target.value))} />
    </div>
  );
};

export default Index;
