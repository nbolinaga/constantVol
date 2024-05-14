const Index = ({ volatility, setVolatility }: { volatility: number, setVolatility: Function }) => {
  const target_volatilities = [0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60]

  return (
    <select className="px-4 py-4 h-fit w-24 rounded-full text-xs border-white text-[#201F31] text-center" id="cryptoCoin" onChange={(e) => setVolatility(e.target.value)}>
      {target_volatilities.map((target, index) => (
        <option key={index} value={target}>{target}</option>
      ))}
    </select>
  );
};

export default Index;
