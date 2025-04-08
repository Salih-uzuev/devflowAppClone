import handleError from "@/lib/handlers/error";
import {APIErrorResponse} from "@/types/global";
import {UserSchema} from "@/lib/validations";
import {NotFoundError, ValidationError} from "@/lib/http-errors";
import User from "@/database/user.model";
import {NextResponse} from "next/server";
import dbConnect from "@/lib/mongoose";

// Get by Post /api/users/email  <--- get user byEmail

export async function POST(request:Request){
    const {email} = await request.json();

    try {
        await dbConnect();
        const validatesData = UserSchema.partial().safeParse({email});
        if(!validatesData.success) throw new ValidationError(validatesData.error.flatten().fieldErrors);

        const user = await User.findOne({email});
        if(!user) throw new NotFoundError('User')

        return NextResponse.json({success:true, data:user}, {status:200})
    }catch (error) {
        return handleError(error,'api') as unknown as APIErrorResponse
    }
}