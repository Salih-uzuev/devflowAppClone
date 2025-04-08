import {NotFoundError, ValidationError} from "@/lib/http-errors";
import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import {APIErrorResponse} from "@/types/global";
import {NextResponse} from "next/server";
import {AccountSchema} from "@/lib/validations";
import Account from "@/database/account.model";

// Get /api/users/[id] <--- get account byID
export async function GET(_:Request, {params}:{params: Promise<{id:string}>} ) {
    const {id} = await params;
    if(!id) throw new NotFoundError("Account");

    try {

        await dbConnect();
        const account = await Account.findById(id);
        if(!account) throw new NotFoundError("Account");

        return NextResponse.json({success:true, data:account}, {status:200})


    }catch (error){
        return handleError(error, 'api') as unknown as APIErrorResponse
    }

}

// Delete /api/users/[id] <--- delete account byID
export async function DELETE(_:Request, {params}:{params: Promise<{id:string}>} ) {
    const {id} = await params;
    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();
        const account = await Account.findByIdAndDelete(id);
        if(!account) throw new NotFoundError("Account");
        return NextResponse.json({success:true, data:account}, {status:200})

    }catch (error){
        return handleError(error, 'api') as unknown as APIErrorResponse
    }
}

// Put /api/users/[id] <--- update account byID
export async function PUT(request:Request, {params}:{params: Promise<{id:string}>} ) {
    const {id} = await params;
    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();
        const body = await request.json();
        const validatedData = AccountSchema.partial().safeParse(body);
        if(!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors);

        const updatedAccount = await Account.findByIdAndUpdate(id, validatedData,{new:true})
        if(!updatedAccount) throw new NotFoundError("Account");
        return NextResponse.json({success:true, data:updatedAccount}, {status:200})


    }catch (error){
        return handleError(error, 'api') as unknown as APIErrorResponse
    }

}