"use client";


import {useState} from "react";
import { api } from "@/lib/api";
import {useParams, useRouter} from "next/navigation";


export default function CreateCampaign(){


const router=useRouter();
const params = useParams();

const groupId = params.id as string;

const [form,setForm]=useState({

title:"",
description:"",
category:"",
code:"",
goal:"",
startDate:"",
endDate:"",

});

const [error, setError] = useState(""); 
const [loading, setLoading] = useState(false);

function change(
e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
){

setForm({
...form,
[e.target.name]:e.target.value
});

}

async function submit(){

try { 
    setLoading(true); 
    setError(""); 
    
    console.log("GROUP ID:", groupId); 
    
    if (!groupId) { setError("Group ID is missing."); return; } 

    if (!form.title.trim()) { setError("Campaign title is required."); return; }

    if (!form.category) { setError("Campaign category is required."); return; }

     if (!form.startDate) {
      setError("Start date is required.");
      return;
    }

    if (!form.endDate) {
      setError("End date is required.");
      return;
    }

    if (form.endDate < form.startDate) {
      setError("End date cannot be before start date.");
      return;
    }
    
    const payload = { 
        title: form.title.trim(), description: form.description.trim(), category: form.category, 
        code: form.code.trim() !== "" ? form.code.trim() : undefined,
        goal: form.goal.trim() !== "" ? Number(form.goal) : undefined, 
        startDate: form.startDate, endDate: form.endDate, }; 
        
        console.log("CREATE CAMPAIGN PAYLOAD:", payload); 
        const response = await api.post( `/groups/${groupId}/campaigns`, payload ); 
        console.log("CAMPAIGN CREATED:", response.data); const campaignId = response.data.id; 
        
        if (!campaignId) { throw new Error( "Campaign was created but no campaign ID was returned." ); 

        } // Go directly to the newly created campaign 
        
        router.push( `/groups/${groupId}/campaigns/${campaignId}` ); 
    } catch (error: any) { console.error( "CREATE CAMPAIGN ERROR:", error ); 
        
        console.error( "STATUS:", error.response?.status ); 
        console.error( "BACKEND RESPONSE:", error.response?.data ); 
        const message = error.response?.data?.message; 
        
        setError( Array.isArray(message) ? message.join(", ") : message || error.message || "Campaign creation failed." ); 
    } finally { setLoading(false); }

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

    <select
    className="border p-2 w-full mt-3"
    name="category"
    value={form.category}
    onChange={change}
    >
    <option value="">Select campaign category</option>

    <option value="Funeral">Funeral</option>
    <option value="Wedding">Wedding</option>
    <option value="Catastrophe">Catastrophe</option>
    <option value="Medical">Medical</option>
    <option value="Education">Education</option>
    <option value="Charity">Charity</option>
    <option value="Entertainment">Entertainment</option>
    <option value="Tourism">Tourism</option>
    <option value="Religious">Religious</option>
    <option value="Community">Community</option>
    <option value="Business">Business</option>
    <option value="Other">Other</option>
    </select>

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

    <input
    className="border p-2 w-full mt-3"
    name="code"
    value={form.code}
    placeholder="Campaign code"
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