import { json } from "better-auth"

const uri='http://localhost:5000'
export const serverMutation=async(path,data)=>{
    const res=await fetch(`${uri}${path}`,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(data)
    })
    return res.json()
}

export const blockUser=async(id, isBlocked)=>{
    const res=await fetch(`${uri}/api/allUsers/${id}/block`,{
        method: 'PATCH',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({isBlocked})
    })
    const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update user status");
  }

  return data;

}