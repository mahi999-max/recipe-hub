'use client'
import { authClient } from "../auth-client"
import { getapi } from "../commonApi/api"

export const getAllfood=async()=>{
   return getapi('/api/allFoods')
}

export const getUseSession  = () => {
  const { data: session } = authClient.useSession();
  return session?.user;
};

export const getMyFood=async(id)=>{
   return getapi(`/api/myfood/${id}`)
}

export const getFoodDetails=async(id)=>{
   return getapi(`/api/allFoods/${id}`)
}
