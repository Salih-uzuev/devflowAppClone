import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {techMap} from "@/constans/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const techDescription: { [key: string]: string } = {
 javascript: "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
 typescript: "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
 react: "React is a popular JavaScript library for building fast and interactive user interfaces.",
 nodejs: "Node.js is a runtime environment that allows you to run JavaScript on the server side, ideal for scalable backend applications.",
 python: "Python is a versatile, high-level programming language known for its readability and wide range of applications, from web to AI.",
 java: "Java is a robust, object-oriented programming language used in enterprise software, Android apps, and large systems.",
 cplusplus: "C++ is a powerful systems-level language used for performance-critical applications such as game engines and operating systems.",
 git: "Git is a distributed version control system that helps developers track changes and collaborate on code efficiently.",
 docker: "Docker is a platform for developing, shipping, and running applications in lightweight, portable containers.",
 mysql: "MySQL is a widely-used open-source relational database management system known for its speed and reliability.",
 mongodb: "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents, ideal for modern applications.",
 aws: "Amazon Web Services (AWS) is a cloud computing platform offering scalable infrastructure and services for applications of all sizes."
};


export const getTechDescription = (techName: string): string => {
 const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
 return techDescription[normalizedTechName]
     ? techDescription[normalizedTechName]
     : `${techName} is a technology or tool widely used in web development, providing valuable features and capabilities.`;
};

export const getDeviconClassName=(techName:string)=>{
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
  return techMap[normalizedTechName] ? `${techMap[normalizedTechName]} colored ` : "devicon-devicon-plain"
}


export const getTimeStamp = (createdAt: Date) => {
 const date = new Date(createdAt);
 const now = new Date();
 const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

 const units = [
  { label: "year", seconds: 31536000 },
  { label: "month", seconds: 2592000 },
  { label: "week", seconds: 604800 },
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "minute", seconds: 60 },
  { label: "second", seconds: 1 },
 ];

 for (const unit of units) {
  const interval = Math.floor(secondsAgo / unit.seconds);
  if (interval >= 1) {
   return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
  }
 }
 return "just now";
};