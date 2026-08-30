"use client";


import {useEffect,useState} from "react";
import { api } from "@/lib/api";
import {useParams} from "next/navigation";
import Link from "next/link";


export default function GroupPage(){


const params=useParams();

const id=params.id as string;


const [group,setGroup]=useState<any>(null);



useEffect(()=>{


async function load(){

      try {

        const res = await api.get(
          `/groups/${id}`
        );


setGroup(res.data);


}

catch(error) {

        console.log(error);

      }

    }


    if(id){
      load();
    }



},[id]);



if(!group)
return <p>KUSANYA Error - page parameters may not exist.</p>



return (

<div className="max-w-xl mx-auto mt-10">


<h1 className="text-3xl font-bold">
{group.name}
</h1>


<p className="mt-3">
{group.description}
</p>


<div className="mt-5">




<p>
Total Members:
{group.members?.length || 0}
<br></br><br></br>

Total Campaigns:
{group.campaigns?.length || 0}
</p>

<Link
  href={`/groups/${id}/members/create`}
  className="inline-block bg-green-600 text-white px-4 py-2 mt-5 rounded"
>
  Add Member
</Link>

<br></br>

<Link
  href={`/groups/${id}/campaigns/create`}
  className="inline-block bg-green-600 text-white px-4 py-2 mt-5 rounded"
>
  Create Campaign
</Link>

<br></br><br></br>

<h2 className="text-xl font-bold">

Members
</h2> 

<div className="mt-5 space-y-3">

  {group.members?.map((member:any)=>(

    <div
      key={member.id}
      className="border rounded p-3"
    >

      <p className="font-bold">
        {member.firstName} {member.lastName}
      </p>


      <p>
        Phone: {member.mobileNumber || "N/A"}
      </p>


      <p>
        Email: {member.email || "N/A"}
      </p>

      <p>
        Comment: {member.comment || "N/A"}
      </p>

      <p>
        Default Contribution:
        {member.defaultContribution || 0}
      </p>


    </div>

  ))}


</div>

</div>
<br></br><br></br>
{/* --------------------------------------------------- */}
<h2 className="text-xl font-bold">
Campaigns (limited access)
</h2>

<div className="mt-5 space-y-3">

  {
  group.campaigns?.map((campaign:any)=>(

    <div
    key={campaign.id}
    className="border rounded p-4"
    >


    <Link
      href={`/groups/${id}/campaigns/${campaign.id}/access`}
      target="_blank"
      rel="noopener noreferrer"
    >

    <h3 className="font-bold text-lg">
    {campaign.title}
    </h3>

    <p>
    Category: 
    {campaign.category}
    </p>

    <p>
    Goal:
    {campaign.goal}
    </p>

    <p>
    Total:
    {campaign.total || 0}
    </p>

    <p>
    Status:
    {campaign.status}
    </p>

    {/* <p>
    Code (to be hidden):
    {campaign.code}
    </p> */}

    <p className="text-blue-600 mt-3">
      🔐 Enter campaign code to access
    </p>

    </Link>


    </div>

      ))
  }

</div>

<br></br><br></br>
{/* ------------------------------------------------ */}

<h2 className="text-xl font-bold">
Campaigns (open)
</h2>

<div className="mt-5 space-y-3">

  {
  group.campaigns?.map((campaign:any)=>(

    <div
    key={campaign.id}
    className="border rounded p-4"
    >

    <Link
      href={`/groups/${id}/campaigns/${campaign.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >

    <h3 className="font-bold text-lg">
    {campaign.title}
    </h3>

    <p>
    Category: 
    {campaign.category}
    </p>

    <p>
    Goal:
    {campaign.goal}
    </p>

    <p>
    Total:
    {campaign.total || 0}
    </p>

    <p>
    Status:
    {campaign.status}
    </p>

    <p>
    Code (to be hidden):
    {campaign.code}
    </p>

    </Link>

    </div>

      ))
  }

</div>

{/* --------------------------------------------------- */}

<br></br><br></br>

  <Link
    href={`/groups/${id}/analytics`}
    className="bg-purple-600 text-white px-5 py-2 rounded"
    target="_blank"
      rel="noopener noreferrer"
  >
    📊 Analytics
  </Link>

</div>

)

}