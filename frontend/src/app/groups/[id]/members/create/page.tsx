"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";


export default function CreateMemberPage() {

const router = useRouter();


const [form,setForm] = useState({

firstName:"",
lastName:"",
phone:"",
email:"",
groupId:"",
defaultPledge:""

});


function handleChange(
e:React.ChangeEvent<HTMLInputElement>
){

setForm({
...form,
[e.target.name]:e.target.value
});

}



async function submit(){

try{


await api.post(
"/members",
{
...form,
defaultPledge:Number(form.defaultPledge)
}
);


alert("Member added");


router.push(
`/groups/${form.groupId}`
);


}catch(error){

console.log(error);
alert("Failed creating member");

}

}



return (

<div className="max-w-md mx-auto mt-10">


<h1 className="text-2xl font-bold">
Add Member
</h1>


<input
className="border p-2 w-full mt-4"
name="firstName"
placeholder="First name"
onChange={handleChange}
/>


<input
className="border p-2 w-full mt-3"
name="lastName"
placeholder="Last name"
onChange={handleChange}
/>


<input
className="border p-2 w-full mt-3"
name="phone"
placeholder="Phone number"
onChange={handleChange}
/>


<input
className="border p-2 w-full mt-3"
name="email"
placeholder="Email"
onChange={handleChange}
/>


<input
className="border p-2 w-full mt-3"
name="defaultPledge"
placeholder="Default pledge"
onChange={handleChange}
/>


<input
className="border p-2 w-full mt-3"
name="groupId"
placeholder="Group ID"
onChange={handleChange}
/>


<button
onClick={submit}
className="bg-blue-600 text-white px-4 py-2 mt-5 rounded"
>
Add Member
</button>


</div>

)

}