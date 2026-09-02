"use client";


import {useState} from "react";
import { api } from "@/lib/api";
import {useRouter} from "next/navigation";


export default function CreateGroup(){


const router = useRouter();


const [form,setForm]=useState({

name:"",
description:"",
ownerId:"USER_ID_HERE"


});


function change(
e:React.ChangeEvent<HTMLInputElement>
){

setForm({
...form,
[e.target.name]:e.target.value
});

}



async function submit(){

try{

const res=await api.post(
"/groups",
form
);


alert("Group created");


router.push(
`/groups/${res.data.id}`
);


}catch(error){

  console.log("CREATE GROUP ERROR:", error);
  console.log("STATUS:", error.response?.status);
  console.log("BACKEND RESPONSE:", error.response?.data);

  alert(
    JSON.stringify(
      error.response?.data || "Failed",
      null,
      2
    )
  );

}

}



return (

<div className="max-w-md mx-auto mt-10">


<h1 className="text-2xl font-bold">
Create Group
</h1>


<input
className="border p-2 w-full mt-5"
name="name"
placeholder="Group name"
onChange={change}
/>


<input
className="border p-2 w-full mt-3"
name="description"
placeholder="Description"
onChange={change}
/>



<button
className="bg-green-600 text-white px-4 py-2 mt-5 rounded"
onClick={submit}
>
Create Group
</button>


</div>

)

}