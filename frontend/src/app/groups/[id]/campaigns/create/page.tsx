"use client";


import {useState} from "react";
import { api } from "@/lib/api";
import {useParams, useRouter} from "next/navigation";


export default function CreateCampaign(){


const router=useRouter();

const params = useParams();

const groupId = params.groupId as string;

const [form,setForm]=useState({

title:"",
description:"",
category:"",
goal:"",
startDate:"",
endDate:"",

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


const response =
await api.post(
`/groups/${groupId}/campaigns`,
{
...form,
goal:Number(form.goal)
}
);



alert("Campaign created");


router.push(
`/groups/${groupId}/campaigns/${response.data.id}`
);



}catch(error){

console.log(error);

alert("Campaign creation failed");

}


}



return (

<div className="max-w-md mx-auto mt-10">


<h1 className="text-2xl font-bold">
Create Campaign
</h1>


<input
className="border p-2 w-full mt-4"
name="title"
placeholder="Campaign title"
onChange={change}
/>



<textarea
className="border p-2 w-full mt-3"
name="description"
placeholder="Description"
onChange={(e)=>
setForm({
...form,
description:e.target.value
})
}
/>



<input
className="border p-2 w-full mt-3"
name="category"
placeholder="Category"
onChange={change}
/>



<input
className="border p-2 w-full mt-3"
name="goal"
placeholder="Target amount"
onChange={change}
/>



<label>
Start Date
</label>

<input
type="date"
className="border p-2 w-full"
name="startDate"
onChange={change}
/>



<label>
End Date
</label>

<input
type="date"
className="border p-2 w-full"
name="endDate"
onChange={change}
/>



<button
onClick={submit}
className="bg-green-600 text-white px-4 py-2 mt-5 rounded"
>
Create Campaign
</button>


</div>

)

}