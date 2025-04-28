import {object, z} from 'zod'

export const SignInSchema = z.object(({
    email: z
        .string()
        .min(1,{message:'Email is required'})
        .email({message:"Please Provide Valid Email Address"}),

    password:z
        .string()
        .min(6,{message:"Password must be at least 6 characters long."})
        .max(100, {message:"Password cannot exceed 100 characters"})
}))

export const SignUpSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(30, { message: "Username cannot exceed 30 characters." })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Username can only contain letters, numbers, and underscores.",
        }),

    name: z
        .string()
        .min(1, { message: "Name is required." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .regex(/^[a-zA-Z\s]+$/, {
            message: "Name can only contain letters and spaces.",
        }),

    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Please provide a valid email address." }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .max(100, { message: "Password cannot exceed 100 characters." })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Password must contain at least one special character.",
        }),
});

export const askQuestionSchema = z.object({
    title: z
        .string()
        .min(5, { message: "Title is required." })
        .max(100, { message: "Title cannot exceed 100 characters." }),

    content: z
        .string()
        .min(1, { message: "Body is required." })
        .max(5000, { message: "Body cannot exceed 5000 characters." }),
    tags: z.array(z
        .string()
        .min(1, { message: "Tag is required." })
        .max(30,{message:"Tag cannot exceed 30 characters."})

    )
        .min(1, { message: "At least one tag is required." })
        .max(3, { message: "Maximum of 3 tags are allowed." }),
});

export const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
    email:z.string().email({message: "Please Provide Valid Email Address"}),
    bio: z.string().optional(),
    image: z.string().url({message: "Please Provide Valid URL"}).optional(),
    location: z.string().optional(),
    portfolio: z.string()
        .url({message: "Please Provide Valid URL"})
        .optional(),
    reputation: z.number().optional(),
});


export const AccountSchema = z.object({
    userId: z.string().min(1, { message: "User ID is required." }),
    name: z.string().min(1, { message: "Name is required." }),
    image: z.string().url({ message: "Please provide a valid URL." }).optional(),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .max(100, { message: "Password cannot exceed 100 characters." })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Password must contain at least one special character.",
        })
        .optional(),
    provider: z.string().min(1, { message: "Provider is required." }),
    providerAccountId: z
        .string()
        .min(1, { message: "Provider Account ID is required." }),
});

export const SignInWithOAuthSchema = z.object({
    provider:z.enum(["google" , "github"]),
    providerAccountId:z
        .string()
        .min(1, { message: "Provider Account ID is required." }),
    user:z.object({
        name:z.string().min(1, { message: "Name is required." }),
        username:z.string().min(3, { message: "Username must be at least 3 characters long." }),
        email:z.string().email({message: "Please Provide Valid Email Address"}),
        image:z.string().url({message: "Please Provide Valid URL"}).optional(),
    })
})

export const EditQuestionSchema = askQuestionSchema.extend({
    questionId:z.string().min(1, { message: "Question ID is required." }),
})

export const GetQuestionSchema = z.object({
    questionId:z.string().min(1, { message: "Question ID is required." }),
})

export const PaginatedSearchParamsSchema = z.object(
    {
        page:z.number().int().positive().default(1),
        pageSize:z.number().int().positive().default(10),
        query:z.string().optional(),
        filter:z.string().optional(),
        sort:z.string().optional(),
    }
);

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
    tagId:z.string().min(1, { message: "Tag ID is required." }),
})

export const IncrementViewsSchema = z.object({
    questionId:z.string().min(1, { message: "Question ID is required." }),
})

export const AnswerSchema = z.object({
    content:z.string().min(10, { message: "Answer has to have more than 10 characters." }),
})

export const AnswerServerSchema = AnswerSchema.extend({
    questionId:z.string().min(1, { message: "Question ID is required." }),
})

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
    questionId:z.string().min(1, { message: "Question ID is required." }),
})

export const AIAnswerSchema = z.object({
    question:z.string().min(5, { message: "Question is required" }),
    content:z.string().min(10, { message: "Answer has to have more than 10 characters." }),
    userAnswer:z.string().optional(),
})

export const CreateVoteSchema = z.object({
    targetId:z.string().min(1, { message: "Target ID is required." }),
    targetType:z.enum(["question", "answer"], {message:"Invalid Target Type"}),
    voteType:z.enum(["upvote", "downvote"],{message:"Invalid Target Type"}),
})

export const UpdateVoteCountSchema = CreateVoteSchema .extend({
    change:z.number().min(-1).max(1),
})

export const HasVotedSchema = CreateVoteSchema.pick({
    targetId: true,
    targetType: true
})

export const CollectionBaseSchema = z.object(
    {
        questionId:z.string().min(1, { message: "Question ID is required." }),
    }
)

export const GetUserSchema = z.object({
    userId:z.string().min(3, { message: "Username must be at least 3 characters long." }),
})

export const GetUserQuestionsSchema = PaginatedSearchParamsSchema.extend({
    userId:z.string().min(3, { message: "Username must be at least 3 characters long." }),
})

export const GetUsersAnswersSchema = PaginatedSearchParamsSchema.extend({
    userId:z.string().min(3, { message: "Username must be at least 3 characters long." }),
})

export const GetUsersTagsSchema = z.object({
    userId:z.string().min(3, { message: "Username must be at least 3 characters long." }),
})


