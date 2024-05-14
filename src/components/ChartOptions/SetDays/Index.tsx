const Index = ({ days, setDays }: { days: number, setDays: Function }) => {
  const numberValidation = (e: string) => {
    try {
      if (parseInt(e) > 365) {
        throw new Error('Not a valid number');
      }
    } catch (error) {
      return;
    }

    if (e.match(/^[0-9]*$/)) {
      setDays(e);
    }

  }

  return (
    <input className="py-4 h-fit w-fit rounded-full text-xs border-white text-[#201F31] text-center" placeholder="1-365" type="text" id="days" value={days} onChange={(e) => numberValidation(e.target.value)}>
    </input>
  );
};

export default Index;
