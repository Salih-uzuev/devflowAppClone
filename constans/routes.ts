const ROUTES = {
    HOME:"/",
    SIGN_IN:'/sign-in',
    SIGN_UP:'/sign-up',
    COLLECTION: '/collections',
    COMMUNITY: '/community',
    TAGS: '/tags',
    JOBS: '/jobs',
    PROFILE: (id:string)=> `/profile/${id}`,
    QUESTION: (id:string)=> `/questions/${id}`,
    TAG:(id:string) => `/tags/${id}`,
    ASK_QUESTION:"/ask-question",

};
export default ROUTES