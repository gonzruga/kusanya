"use client";


import {useEffect,useState} from "react";
import { api } from "@/lib/api";
import {useParams} from "next/navigation";
import Link from "next/link";



export default function CampaignPage(){


    
const params=useParams();

const groupId=params.id as string;
const campaignId=params.campaignId as string;


const [campaign,setCampaign]=useState<any>();

console.log(params);
console.log("groupId:", groupId);
console.log("campaignId:", campaignId);

useEffect(()=>{


async function load(){

 try {
      console.log(
        `/groups/${groupId}/campaigns/${campaignId}`
      );

const response =
await api.get(
`/groups/${groupId}/campaigns/${campaignId}`
);

console.log(response.data);


setCampaign(response.data);
}  catch (err) {
      console.error(err);
    }
  }

if (groupId && campaignId) {
  load();
}

},[groupId,campaignId]);


if(!campaign)
return <p>KUSANYA Error - page parameters may not exist.</p>


const percentage =
campaign.goal
  ? (campaign.totalRaised || 0) / campaign.goal * 100
  : 0;

return (

<div className="max-w-xl mx-auto mt-10">


<h1 className="text-3xl font-bold">
{campaign.title}
</h1>

<p className="mt-4">
{campaign.description}
</p>

<div className="mt-5">

<p>
Goal:
{campaign.goal}
</p>


<p>
Total:
{campaign.totalRaised || 0}
</p>


<div className="border mt-3 h-5">

<div
className="bg-green-500 h-5"
style={{
width:`${percentage}%`
}}
/>


</div>


</div>

<p>
Number of Contributions:
{campaign.contributions?.length || 0}
</p>

<br></br>

<p>
  Please contribute via mobile money using transaction reference code:  {campaign.code}
</p>

<br></br>

<Link
  href={`/groups/${groupId}/campaigns/${campaign.id}/contributions/create`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block bg-blue-600 text-white px-5 py-2 mt-6 rounded"
>
  Contribute
</Link>

<div className="space-y-3 mt-4">

{
campaign.contributions?.map((contribution:any)=>(

<div
key={contribution.id}
className="border rounded p-3"
>

<p>

<strong>Member:</strong>

{" "}

{contribution.member?.firstName}

{" "}

{contribution.member?.lastName}

</p>

<p>

<strong>Phone:</strong>

{" "}

{contribution.mobileNumber}

</p>

<p>

<strong>Amount:</strong>

{" "}

{contribution.amount}

{" "}

{contribution.currency}

</p>

<p>

<strong>Status:</strong>

{" "}

{contribution.status}

</p>

<p>

<strong>Provider:</strong>

{" "}

{contribution.provider}

</p>

</div>

))
}

</div>


</div>

)

} // End of CampaignPage component