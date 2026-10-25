"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";


export default function CreateMemberPage() {

const router = useRouter();
const params = useParams();

const groupId = params.id as string;


const [form,setForm] = useState({

firstName:"",
lastName:"",
mobileNumber:"",
email:"",
comment:"",
defaultContribution:"",
// groupId: groupId,

});

const [error, setError] = useState(""); 
const [loading, setLoading] = useState(false);

function handleChange(
e:React.ChangeEvent<HTMLInputElement>
){

setForm({
...form,
[e.target.name]:e.target.value
});

}

async function submit() { try { setLoading(true); setError(""); 
    if (!groupId) { setError("Group ID is missing."); 
        return; } 
        const payload = { 
            firstName: form.firstName.trim(), 
            lastName: form.lastName.trim(), 
            mobileNumber: form.mobileNumber.trim(), 
            email: form.email.trim() || undefined, 
            comment: form.comment.trim() || undefined, 
            defaultContribution: form.defaultContribution.trim() !== "" ? Number(form.defaultContribution) : undefined, groupId: groupId, }; 
            console.log( "CREATE MEMBER PAYLOAD:", payload ); 
            
            const response = await api.post( "/members", payload ); 
            
            console.log( "MEMBER CREATED:", response.data ); 
            
            router.push(`/groups/${groupId}`); 
        
        } catch (error: any) { 
            console.error( "CREATE MEMBER ERROR:", error ); 
            console.error( "STATUS:", error.response?.status ); console.error( "BACKEND RESPONSE:", error.response?.data ); 
            const message = error.response?.data?.message; setError( Array.isArray(message) ? message.join(", ") : message || "Failed creating member." ); 
        } finally { setLoading(false); } }



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
name="mobileNumber"
placeholder="Mobile number"
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
name="comment"
placeholder="Comment"
onChange={handleChange}
/>

<input
className="border p-2 w-full mt-3"
name="defaultContribution"
placeholder="Default contribution pledge"
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