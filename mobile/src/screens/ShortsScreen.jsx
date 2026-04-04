import React, { useContext, useEffect, useState } from "react";
import { ShortContext } from "../context/ShortContext";
import BASE_URL from "../api/api";
import ShortsList from "../components/ShortsList"
// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const ShortsScreen = () => {
  // const bottomTabBarHeight = useBottomTabBarHeight();
  const { shorts, setShorts } = useContext(ShortContext);
  const [page, setPage] = useState(1);

  const getShorts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/shorts?page=${page}`);
      const data = await res.json();
      setShorts(prev => [...prev, ...data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShorts();
  }, [page]);

  return (
    <ShortsList shorts={shorts} setShorts={setShorts} onEndReached={() => setPage(prev => prev + 1)} />
  )
}
export default ShortsScreen
