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
