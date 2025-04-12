"use server"
import mongoose from "mongoose";

import Question from "@/database/question.model";
import {ActionResponse, ErrorResponse} from "@/types/global";
import action from "@/lib/handlers/action";
import {askQuestionSchema} from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

// @ts-ignore
export async function createQuestion(params:CreateQuestionParamas):Promise<ActionResponse<Question>>{

    const validationResult = await action({params,schema:askQuestionSchema,authorize:true});

    if(validationResult instanceof Error){
        return handleError(validationResult) as unknown as ErrorResponse;
    }

    const {title,content, tags} = validationResult.params!;
    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const [question] = await Question.create([{title, content, author:userId}],{session});

        if(!question){
            throw new Error('Failed to create question');
        }

        const tagIds: mongoose.Types.ObjectId[] = [];
        const tagQuestionDocuments = [];

        for (const tag of tags){
            const existingTag = await Tag.findOneAndUpdate({name:{$regex: new RegExp(`^${tag}$`, "i")}},
            {$setOnInsert:{name:tag}, $inc:{questions:1}},
                {upsert:true, new:true, session}
            );
            tagIds.push(existingTag._id);
            tagQuestionDocuments.push({tag:existingTag._id, question:question._id});
        }

        await TagQuestion.insertMany(tagQuestionDocuments,{session});
        await Question.findByIdAndUpdate(
            question._id,
            {$push:{tags:{$each:tagIds}}},
            {session}
        );

        await session.commitTransaction();
        return {success:true, data:JSON.parse(JSON.stringify(question))};

    }catch (e) {
        await session.abortTransaction();
        return handleError(e) as unknown as ErrorResponse;
    }finally {
        session.endSession();
    }

}
