import handleError from "@/lib/handlers/error";
import {APIErrorResponse} from "@/types/global";
import {AccountSchema} from "@/lib/validations";
import {NotFoundError, ValidationError} from "@/lib/http-errors";
import {NextResponse} from "next/server";
import Account from "@/database/account.model";

// Get by Post /api/users/email  <--- get account byEmail

export async function POST(request:Request){
    const {providerAccountId} = await request.json();

    try {
        const validatesData = AccountSchema.partial().safeParse({providerAccountId});
        if(!validatesData.success) throw new ValidationError(validatesData.error.flatten().fieldErrors);

        const account = await Account.findOne({providerAccountId});
        if(!account) throw new NotFoundError('Account')

        return NextResponse.json({success:true, data:account}, {status:200})
    }catch (error) {
        return handleError(error,'api') as unknown as APIErrorResponse
    }
}