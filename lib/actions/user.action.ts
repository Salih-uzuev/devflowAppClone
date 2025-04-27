"use server"

import {ActionResponse, ErrorResponse, PaginatedSearchParams} from "@/types/global";
import action from "@/lib/handlers/action";
import {
    GetUserQuestionsSchema,
    GetUsersAnswersSchema,
    GetUserSchema,
    PaginatedSearchParamsSchema
} from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import {FilterQuery} from "mongoose";
import {Answer, Question, User} from "@/database";
import {GetUserAnswersParams, GetUserParams, GetUserQuestionsParams} from "@/types/action";

// @ts-ignore
export async function getUsers(params:PaginatedSearchParams):Promise<ActionResponse<{
    users:User[], isNext:boolean}>>{
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
    });

    if(validationResult instanceof Error){
        return handleError(validationResult) as unknown as ErrorResponse;
    }

    const {page=1, pageSize=10, query, filter} = params;
    const skip = (Number(page)-1) * pageSize;
    const limit = Number(pageSize);

    const filterQuery: FilterQuery<typeof User> = {};

    if(query){
        filterQuery.$or = [
            {username:{$regex: new RegExp(query, "i")}},
            {email:{$regex: new RegExp(query, "i")}}
        ]
    }

    let sortCriteria = {};

    switch (filter){
        case 'newest':
            sortCriteria = {createdAt:-1};
            break;
        case 'oldest':
            sortCriteria = {createdAt:1};
            break;
        case 'popular':
            sortCriteria = {reputation:-1};
            break;
        default:
            sortCriteria = {createdAt:-1};
            break;
    }

    try {
        const totalUsers = await User.countDocuments(filterQuery);
        const users = await User.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)

        const isNext = totalUsers > skip + users.length;

        return {success:true, data:{users:JSON.parse(JSON.stringify(users)), isNext}}

    }catch (error) {
        return handleError(error) as unknown as ErrorResponse;

    }
}

export async function getUser (params:GetUserParams):Promise<ActionResponse<{
    user: User;
    totalQuestion:number;
    totalAnswers:number;
}>>{
    const validationResult = await action({
        params,
        schema:GetUserSchema,
        authorize:true
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as unknown as ErrorResponse;
    }

    const {userId} = params;

    try {
        const user = await User.findById(userId);
        if(!user) throw new Error('User not found');

        const totalQuestion = await Question.countDocuments({author:userId});
        const totalAnswers = await Answer.countDocuments({author:userId});

        return {success:true,
            data:{user:JSON.parse(JSON.stringify(user)), totalQuestion, totalAnswers}}

    }catch (error){
        return handleError(error) as unknown as ErrorResponse;
    }
}

export async function getUserQuestions (params:GetUserQuestionsParams):Promise<ActionResponse<{
    questions:Question[];
    isNext:boolean;
}>>{
    const validationResult = await action({
        params,
        schema:GetUserQuestionsSchema,
        authorize:true
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as unknown as ErrorResponse;
    }

    const {userId, page=1, pageSize=10} = params;

    const skip = (Number(page)-1) * pageSize;
    const limit = Number(pageSize);

    try {
        const totalQuestions = await Question.countDocuments({author:userId});
        const questions = await Question.find({author:userId})
            .populate("tags", "name")
            .populate("author", "name image")
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit);

        const isNext = totalQuestions > skip + questions.length;


        return {success:true,
            data:{
            questions:JSON.parse(JSON.stringify(questions)),
            isNext
            },
        }

    }catch (error){
        return handleError(error) as unknown as ErrorResponse;
    }
}

export async function getUsersAnswers (params:GetUserAnswersParams):Promise<ActionResponse<{
    answers:Answer[];
    isNext:boolean;
}>> {
    const validationResult = await action({
        params,
        schema: GetUsersAnswersSchema,
        authorize: true
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as unknown as ErrorResponse;
    }

    const {userId, page = 1, pageSize = 10} = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    try {
        const totalAnswers = await Answer.countDocuments({author: userId});
        const answers = await Answer.find({author: userId})
            .populate("author", "_id name image")
            .skip(skip)
            .limit(limit);

        const isNext = totalAnswers > skip + answers.length;


        return {
            success: true,
            data: {
                answers: JSON.parse(JSON.stringify(answers)),
                isNext
            },
        }

    } catch (error) {
        return handleError(error) as unknown as ErrorResponse;
    }
}




