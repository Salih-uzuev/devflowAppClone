import handleError from "@/lib/handlers/error";
import {APIErrorResponse} from "@/types/global";
import dbConnect from "@/lib/mongoose";
import {NextResponse} from "next/server";
import {AccountSchema} from "@/lib/validations";
import {ForbiddenError} from "@/lib/http-errors";
import Account from "@/database/account.model";

//Get all Accounts
export async function GET(){
    try {
        await dbConnect();

        const accounts = await Account.find();
        return NextResponse.json({success:true, data:accounts}, {status:200})

    }catch (error) {
        return handleError(error,'api') as unknown as APIErrorResponse;

    }
}


//Create a new Account
export async function POST(request:Request){
    try {
        await dbConnect();
        const body = await request.json();
        const validatedData = AccountSchema.parse(body);

        const existingAccount = await Account.findOne({provider: validatedData.provider, providerAccountId: validatedData.providerAccountId});
        if(existingAccount) throw new ForbiddenError("An Account with same provider already exists");

        const newAccount = await Account.create(validatedData);


        return NextResponse.json({success:true, data:newAccount}, {status:201});

    }catch (error){
        return handleError(error, 'api') as unknown as APIErrorResponse
    }
}
