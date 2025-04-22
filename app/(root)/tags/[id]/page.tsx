import React from 'react'
import {RouteParams} from "@/types/global";
import {getTagQuestions} from "@/lib/actions/tag.actions";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constans/routes";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import DataRenderer from "@/components/DataRenderer";
import {EMPTY_QUESTION} from "@/constans/states";
import QuestionCard from "@/components/cards/QuestionCard";
import {TagFilters} from "@/constans/filters";
import CommonFilter from "@/components/filters/CommonFilter";

const Page = async ({params, searchParams}:RouteParams) => {
    const {id} = await params;
    const {page, pageSize, query} = await searchParams
    const {success, data, error} = await getTagQuestions({
        tagId:id,
        page:Number(page) || 1,
        pageSize:Number(pageSize) || 10,
        query
    })
    const { tag, questions } = data || {};

    return (
        <>
            <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
            </section>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch route={ROUTES.TAG(id)}
                             imgSrc='/icons/search.svg'
                             placeholder="Search Questions..."
                             otherClasses="flex-1"
                />
                <CommonFilter filters={TagFilters} otherClasses="min-h-[56px] sm:min-w-[170px]"/>
            </div>
            <DataRenderer success={success} data={questions} error={error} empty={EMPTY_QUESTION}     render={(questions) => (
                <div className="mt-10 flex w-full flex-col gap-6">
                    {questions.map((question) => (
                        <QuestionCard key={question._id} question={question} />
                    ))}
                </div>
            )}
            />

        </>
    )
}
export default Page
