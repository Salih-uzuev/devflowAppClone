"use server"

import {CollectionBaseParams} from "@/types/action";
import {ActionResponse, ErrorResponse} from "@/types/global";
import action from "@/lib/handlers/action";
import {CollectionBaseSchema} from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import {Collection, Question} from "@/database";
import {revalidatePath} from "next/cache";
import ROUTES from "@/constans/routes";

export async function toggleSaveQuestion(params:CollectionBaseParams):Promise<ActionResponse<{saved:boolean}>>{
    const validationResult = await action(
        {
            params,
            schema:CollectionBaseSchema,
            authorize:true
        }
    )

    if (validationResult instanceof Error) {
        return handleError(validationResult) as unknown as ErrorResponse;
    }

    const {questionId} = validationResult.params!;
    const userId = validationResult.session?.user?.id;

    try {
        const question = await Question.findById(questionId);

        if(!question){
            throw new Error('Question not found');
        }

        const collection = await Collection.findOne({
            questions:questionId,
            author:userId,
        })

        if(collection){
            await Collection.findByIdAndDelete(collection._id)
            revalidatePath(ROUTES.QUESTION_DETAILS(questionId));

            return{
                success:true,
                data:{
                    saved:false
                }
            }
        }

        await Collection.create({
            questions:questionId,
            author:userId
        })

        revalidatePath(ROUTES.QUESTION_DETAILS(questionId));
        return {
            success:true,
            data:{
                saved:true
            }
        }





    }catch (error){
        return handleError(error) as unknown as ErrorResponse
    }




}


export async function hasSavedQuestion(params:CollectionBaseParams):Promise<ActionResponse<{saved:boolean}>> {
    const validationResult = await action(
        {
            params,
            schema: CollectionBaseSchema,
            authorize: true
        }
    )

    if (validationResult instanceof Error) {
        return handleError(validationResult) as unknown as ErrorResponse;
    }

    const {questionId} = validationResult.params!;
    const userId = validationResult.session?.user?.id;

    try {
        const collection = await Collection.findOne({
            questions: questionId,
            author: userId
        })


        return {
            success: true,
            data: {
                saved: !!collection, // Convert to boolean
            }
        }


    } catch (error) {
        return handleError(error) as unknown as ErrorResponse
    }
}