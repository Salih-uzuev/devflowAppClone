"use server"

import {CollectionBaseParams} from "@/types/action";
import {ActionResponse, ErrorResponse, PaginatedSearchParams} from "@/types/global";
import action from "@/lib/handlers/action";
import {CollectionBaseSchema, PaginatedSearchParamsSchema} from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import {Collection, Question} from "@/database";
import {revalidatePath} from "next/cache";
import ROUTES from "@/constans/routes";
import mongoose, {FilterQuery, PipelineStage} from "mongoose";

export async function toggleSaveQuestion(params:CollectionBaseParams):Promise<ActionResponse<{saved:boolean}>>{
    const validationResult = await action(
        {
            params,
            schema:CollectionBaseSchema,
            authorize:true
        }
    )

    console.log("[toggleSaveQuestion] validationResult:", validationResult);

    if (validationResult instanceof Error) {
        return handleError(validationResult) as unknown as ErrorResponse;
    }

    const {questionId} = validationResult.params!;
    const userId = validationResult.session?.user?.id;

    try {
        console.log(`[toggleSaveQuestion] userId: ${userId}, questionId: ${questionId}`);
        const question = await Question.findById(questionId);

        if(!question){
            throw new Error('Question not found');
        }

        const collection = await Collection.findOne({
            question:questionId,
            author:userId,
        })

        if(collection){
            await Collection.findByIdAndDelete(collection._id)
            console.log("Collection deleted.");
            revalidatePath(ROUTES.QUESTION_DETAILS(questionId));

            return{
                success:true,
                data:{
                    saved:false
                }
            }
        }

        await Collection.create({
            question:[questionId],
            author:userId
        })
        console.log("Collection created.");

        revalidatePath(ROUTES.QUESTION_DETAILS(questionId));
        return {
            success:true,
            data:{
                saved:true
            }
        }





    }catch (error){
        console.error("[toggleSaveQuestion] error:", error);
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
            question: questionId,
            author: userId
        })
        console.log("Collection found:", collection);


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

export async function getSavedQuestions(params:PaginatedSearchParams):Promise<ActionResponse<{collection:Collection[], isNext:boolean}>> {
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
        authorize: true
    });

    if(validationResult instanceof Error){
        return handleError(validationResult) as unknown as ErrorResponse;
    }

    const userId = validationResult.session?.user?.id;
    const {page=1, pageSize=10, query, filter} = params!;
    const skip = (Number(page)-1) * pageSize;
    const limit = pageSize;

    const filterQuery:FilterQuery<typeof Collection> = {author:userId};

    if(query){
        filterQuery.$or = [
            {"question.title":{$regex: new RegExp(query, "i")}},
            {"question.content":{$regex: new RegExp(query, "i")}}
        ]
    }

    const sortOptions:Record<string, Record<string, 1 | -1>> = {
        mostRecent:{"question.createdAt":-1},
        oldest:{"question.createdAt":1},
        mostvoted:{"question.upvotes":-1},
        mostviewed:{"question.views":-1},
        mostanswered:{"question.answers":-1},
    }

    const sortingCriteria = sortOptions[filter as keyof typeof sortOptions] || {"question.createdAt":-1};

    try {
        const pipeline:PipelineStage[] = [
            {$match:{"author": new mongoose.Types.ObjectId(userId)}},
            {$lookup:{
                from:"questions",
                localField:"question",
                foreignField:"_id",
                as:"question"
                }
            },
            {$unwind:"$question"},
            {$lookup:{
                from:"users",
                    localField: "question.author",
                    foreignField: "_id",
                    as: "question.author",
                }
            },
            {$unwind:"$question.author"},
            {$lookup:{
                from:"tags",
                localField:"question.tags",
                foreignField:"_id",
                as:"question.tags"

                }
            },
        ];

        if(query){
            pipeline.push({
                $match:{
                    $or:[
                        {"question.title":{$regex: new RegExp(query, "i")}},
                        {"question.content":{$regex: new RegExp(query, "i")}}

                    ]
                }
            })
        }

        const [totalCount] = await Collection.aggregate([
            ...pipeline,
            {$count:"count"}
        ])

        pipeline.push({$sort:sortingCriteria},{$skip:skip},{$limit:limit});
        pipeline.push({$project:{question:1, author:1}});

        const questions = await Collection.aggregate(pipeline)
        const isNext = totalCount?.count > skip + questions.length;

        return {
            success:true,
            data:{collection:JSON.parse(JSON.stringify(questions)), isNext}
        }

    }catch(error){
        return handleError(error) as unknown as ErrorResponse
    }
}