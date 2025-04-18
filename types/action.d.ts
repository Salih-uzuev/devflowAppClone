import {PaginatedSearchParams} from "@/types/global";

interface SignInWithOAuthParams{
    provider:'github'| 'google',
    providerAccountId:string,
    user:{name:string,email:string,image?:string, username:string | undefined}
}

interface AuthCredentials{
    name:string,
    username:string,
    email:string,
    password:string;
}

interface CreateQuestionParamas{
    title:string,
    content:string,
    tags:string[],

}

interface EditQuestionParams extends CreateQuestionParamas{
    questionId:string;
}

interface GetQuestionParams{
    questionId:string;
}

interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, "filter">{
    tagId:string;
}

interface IncrementViewsParams{
    questionId:string;
}

interface CreateAnswerParams{
    questionId:string;
    content:string;
}

interface GetAnswersParams extends PaginatedSearchParams{
    questionId:string;
}
