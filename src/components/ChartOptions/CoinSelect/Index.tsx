import { useState, useEffect } from "react";

const Index = ({ coins, setCoin }: { coins: string[], setCoin: Function }) => {

  const changeCoin = (coin: string) => {
    setCoin(coin);
  }

  return (
    <select className="px-10 py-4 h-fit w-fit rounded-full text-xs border-white text-[#201F31] text-center" id="cryptoCoin" onChange={(e) => changeCoin(e.target.value)}>
      {coins.map((coin, index) => (
        <option key={index} value={coin}>{coin}</option>
      ))}
    </select>
  );
};

export default Index;
