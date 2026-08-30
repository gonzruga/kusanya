"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";


export default function GroupsPage() {

  const [groups, setGroups] = useState<any[]>([]);


  useEffect(() => {

    async function loadGroups() {

      try {

        const response = await api.get("/groups");

        setGroups(response.data);

      } catch(error) {

        console.log(error);

      }

    }


    loadGroups();

  }, []);



  return (

    <div className="max-w-xl mx-auto mt-10">

      <h1 className="text-3xl font-bold">
        All Groups
      </h1>

        <Link
          href="/groups/create"
          className="inline-block bg-green-600 text-white px-4 py-2 mt-5 rounded"
        >
          Create Group
        </Link>

      <div className="mt-6 space-y-4">


        {groups.map((group)=>(

          <Link
            key={group.id}
            href={`/groups/${group.id}`}
            className="block border rounded p-4 hover:bg-gray-100"
          >

            <h2 className="text-xl font-bold">
              {group.name}
            </h2>


            <p>
              {group.description}
            </p>


          </Link>

        ))}


      </div>


    </div>

  );

}