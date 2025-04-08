import {Button} from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constans/routes";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";


const questions = [
    {_id:"1", title:"How to create a custom hook in React?", description:"I want to learn react can anyone help me?",
        tags:[
            {_id:"1", name:"react"},
            {_id:"2", name:"javascript"},
        ], author:{_id:"1", name:"John Doe", image: "data:image/jpeg;base64,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"},
        upvotes:10,
        answers:5,
        views:100,
        createdAt:new Date("2024-03-01"),


    },
    {_id:"2", title:"How to create a custom hook in Js?", description:"I want to learn Js can anyone help me?", tags:[
            {_id:"1", name:"javascript"},
            {_id:"2", name:"javascript"},
        ], author:{_id:"2", name:"John Doe", image:"data:image/jpeg;base64,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"},
        upvotes:10,
        answers:5,
        views:100,
        createdAt:new Date("2023-01-01"),

    },


]




interface SearchParams {
    searchParams:Promise<{[key:string]: string}>
}

const Home = async ({searchParams}:SearchParams)=> {



    const { query = "", filter = "" } = await searchParams;

    const filteredQuestions = questions.filter((question) => {
        // Match query against the title
        const matchesQuery = question.title
            .toLowerCase()
            .includes(query.toLowerCase());

        // Match filter against tags or author name, adjust logic as needed
        const matchesFilter = filter
            ? question.tags.some(
            (tag) => tag.name.toLowerCase() === filter.toLowerCase()
        ) || question.author.name.toLowerCase() === filter.toLowerCase()
            : true; // If no filter is provided, include all questions

        return matchesQuery && matchesFilter;
    });


    return(

        <>
            <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900" asChild>
                    <Link href={ROUTES.ASK_QUESTION}>
                        Ask a Question
                    </Link>
                </Button>
            </section>

            <section className="mt-11">
                <LocalSearch route='/'
                imgSrc='/icons/search.svg'
                placeholder="Search Questions..."
                otherClasses="flex-1"

                />
            </section>

            <HomeFilter/>

            <div className="mt-10 flex w-full flex-col gap-6">
                {filteredQuestions.map((question)=>(
                    <QuestionCard key={question._id} question={question}/>
                ))}

            </div>

        </>


    );
}
export default Home;

