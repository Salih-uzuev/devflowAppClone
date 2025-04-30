import {CreateInteractionParams, UpdateReputationParams} from "@/types/action";
import {IInteractionDoc} from "@/database/interaction.model";
import {ActionResponse, ErrorResponse} from "@/types/global";
import action from "@/lib/handlers/action";
import {CreateInteractionSchema} from "@/lib/validations";
import handleError from "@/lib/handlers/error";
import mongoose from "mongoose";
import {Interaction, User} from "@/database";

export async function createInteraction(params:CreateInteractionParams):Promise<ActionResponse<IInteractionDoc>> {
    const validationResult = await action({
        params,
        schema: CreateInteractionSchema,
        authorize: true
    });

    if(validationResult instanceof Error){
        return handleError(validationResult) as unknown as ErrorResponse;
    }

    const {
        action: actionType,
        actionId,
        actionTarget,
        authorId
    } = validationResult.params!;
    const userId = validationResult.session?.user?.id;

    if(!userId) return handleError(new Error("Unauthorized")) as unknown as ErrorResponse;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [interaction] = await Interaction.create(
            [
                {
                    user: userId,
                    action: actionType,
                    actionId: actionId,
                    actionType: actionTarget
                },
            ],
            {session}
        );

        //TODO: Update reputation for both the performer and the content author.
        await updateReputation({
            interaction,
            session,
            authorId,
            performedId: userId!
        })

        await session.commitTransaction();

        return {success:true, data:JSON.parse(JSON.stringify(interaction))};

    }catch (error){
        await session.abortTransaction();
        return handleError(error) as unknown as ErrorResponse;
    }finally {
        await session.endSession();
    }

}


export async function updateReputation(params:UpdateReputationParams){
    const {interaction, session, authorId, performedId} = params;
    const {action, actionType} = interaction;

    let performerPoints = 0;
    let authorPoints = 0;



    switch (action){
        case "upvote":
            performerPoints = 2;
            authorPoints = 10;
            break;
            case "downvote":
            performerPoints = -1;
            authorPoints = -2;
            break;
        case "post":
            authorPoints = actionType === "question" ? 5 : 10;
            break;
        case "delete":
            authorPoints = actionType === "question" ? -5 : -10;
            break;
    }

    if(performedId === authorId){
        await User.findByIdAndUpdate(
            performedId,
            {$inc:{reputation:authorPoints}},
            {session}
        );
        return;
    }

    await User.bulkWrite(
        [
            {
                updateOne:{
                    filter:{_id:performedId},
                    update:{$inc:{reputation:performerPoints}},
                },
            },
            {
                updateOne:{
                    filter:{_id:authorId},
                    update:{$inc:{reputation:authorPoints}},
                },
            }
        ],
        {session}
    )
}