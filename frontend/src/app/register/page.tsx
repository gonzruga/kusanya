"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";


export default function RegisterPage() {

  const router = useRouter();

  const [form, setForm] = useState({
    firstName:"",
    lastName:"",
    phone:"",
    email:"",
    password:""
  });


  const handleChange = (
    e:React.ChangeEvent<HTMLInputElement>
  )=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };


  async function submit(){

    try {

      const response = await api.post(
        "/auth/register",
        form
      );


      console.log(response.data);

      alert("User created");

      router.push("/groups/create");


    } catch(error){

      console.log(error);
      alert("Registration failed");

    }

  }


return (

<div className="max-w-md mx-auto mt-10">

<h1 className="text-2xl font-bold mb-5">
Create User
</h1>


<input
className="border p-2 w-full mb-3"
name="firstName"
placeholder="First name"
onChange={handleChange}
/>


<input
className="border p-2 w-full mb-3"
name="lastName"
placeholder="Last name"
onChange={handleChange}
/>


<input
className="border p-2 w-full mb-3"
name="phone"
placeholder="Phone"
onChange={handleChange}
/>


<input
className="border p-2 w-full mb-3"
name="email"
placeholder="Email"
onChange={handleChange}
/>


<input
className="border p-2 w-full mb-3"
name="password"
type="password"
placeholder="Password"
onChange={handleChange}
/>


<button
onClick={submit}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Register
</button>


</div>

);

}