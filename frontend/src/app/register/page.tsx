"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";


export default function RegisterPage() {

  const router = useRouter();

  const [form, setForm] = useState({
    firstName:"",
    lastName:"",
    mobileNumber:"",
    email:"",
    password:""
  });

  const [loading, setLoading] = useState(false);

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


    console.log("Registration response:", response.data); // Get the ID of the newly created user 
    
    const userId = response.data.id; 

    if (!userId) { throw new Error( "User was created, but the backend did not return a user ID." ); }

      alert("User creation attemp done");

      router.push(`/users/${userId}`); // Redirect to the user details page after successful registration


    } catch (error: any) {
      console.log("Registration error:", error);
      console.log("Status:", error.response?.status);
      console.log("Backend response:", error.response?.data);

      alert(
        JSON.stringify(

          error.response?.data || "Registration failed -RegisterPage",
          null,
          2
        )
      );

    } finally { setLoading(false); }
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
    name="mobileNumber"
    placeholder="Mobile Number"
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

