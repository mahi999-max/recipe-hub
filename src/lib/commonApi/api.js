'use server'
const uri='http://localhost:5000'
export const getapi=async(req)=>{
    const res=await fetch(`${uri}${req}`,{
        cache:'no-store'
    })
    return res.json()
}