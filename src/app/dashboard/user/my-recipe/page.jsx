'use client'
import { getMyFood, getUseSession } from '@/lib/api/getApi';
import React, { useEffect, useState } from 'react';

const MyRecipe = () => {
    const user=getUseSession()
    const [userfood,setuserfood]=useState([])
   useEffect(() => {
  if (!user?.id) return;

  const fetchData = async () => {
    try {
      const result = await getMyFood(user.id);
      console.log("My Food:", result);
      setuserfood(result);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [user?.id]);
    console.log("Food: ",userfood);
    return (
        <div>
            {userfood.length}
        </div>
    );
};

export default MyRecipe;
