"use client"
import  {useEffect} from 'react'
import {incrementViews} from "@/lib/actions/question.action";
import {toast} from "@/hooks/use-toast";


const Views = ({questionId}:{questionId:string}) => {

    const handleIncrement = async () =>{
        const result = await incrementViews({questionId})

        if(result.success){
            toast({
                title:"Success",
                description:"Views incremented",
            })
        }else {
            toast({
                title:"Error",
                description:result.error?.message,
                variant:"destructive"
            })
        }

    }


        useEffect(()=>{
            handleIncrement();
        }, [])

    return null;
}
export default Views
