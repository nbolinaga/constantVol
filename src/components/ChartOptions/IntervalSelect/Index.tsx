const Index = ({ setInterval }: { setInterval: Function }) => {
  const intervals = ['Daily', 'Hourly'];
  return (
    <select className="px-10 py-4 h-fit w-fit rounded-full text-xs border-white text-[#201F31] text-center" id="interval" onChange={(e) => setInterval(e.target.value)}>
      {intervals.map((interval, index) => (
        <option key={index} value={interval}>{interval}</option>
      ))}
    </select>
  );
};

export default Index;
