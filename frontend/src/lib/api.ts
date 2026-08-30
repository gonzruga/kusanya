import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:3000",

  // Below variable is defined in .env.local file:   // baseURL: "http://localhost:3000",
  baseURL: process.env.NEXT_PUBLIC_API_URL


//   baseURL: process.env.NODE_ENV === "production" ? "https://api.example.com" : "http://localhost:3000",

});

// I shall use this api instance everywhere and remember to change the baseURL in .env.local file on production deployment:
