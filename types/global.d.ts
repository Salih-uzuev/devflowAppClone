interface Tag {
    _id: string;
    name: string;
    questions: number;
}

interface Author {
    _id: string;
    name: string;
    image:string
}

interface Questions {
    _id: string;
    title: string;
    tags: Tag[];
    author: Author;
    cretedAt:Date;
    upvotes: number;
    answers: number;
    views: number;
    createdAt: Date;
}