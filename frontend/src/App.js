import logo from './logo.svg';
import './App.css';
import { Flex } from '@chakra-ui/react';
import Compartment from './components/Compartment';
import InputBox from './components/InputBox';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    setLoading(false);

    try {
      const response = await axios.get("https://seat-booking-tg8y.onrender.com/api/seats");
      setLoading(true);
      setData(response.data.availableSeats);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(true);
    }
  };

  return (
    <Flex justify={"space-around"} align={"center"} h="100vh" minHeight={"fit-content"} bg={"#E5E7EB"} >

      <Compartment data={data} loading={loading} />

      <InputBox fetchData={fetchData} setData={setData} data={data} />

    </Flex>
  );
}

export default App;
