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