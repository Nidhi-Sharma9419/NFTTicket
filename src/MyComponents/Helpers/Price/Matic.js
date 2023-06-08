import { devserver } from "../config";

const Matic  = async (price) => {
  try {
    if (!price || !(price > 0)) {
      return "0";
    }
    const res = await fetch(`${devserver}/api/conversion/sepolia/${price}`);
    const data = await res.json();
    if (res.status == 500) {
      throw new Error(data.error);
    }
    return data.sepolia;
  } catch (error) {
    console.error(error.message);
    return "0";
  }
};

export default Matic ;
