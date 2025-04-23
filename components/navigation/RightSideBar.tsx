import React from 'react'
import Link from "next/link";
import ROUTES from "@/constans/routes";
import Image from "next/image";
import TagCard from "@/components/cards/TagCard";
import {getHotQuetions} from "@/lib/actions/question.action";
import DataRenderer from "@/components/DataRenderer";
import {getTopTags} from "@/lib/actions/tag.actions";





const RightSideBar = async () => {
    const {success, data:hotQuestions, error } =  await getHotQuetions();
    const {success:tagSuccess, data:tagss, error:tagError } =  await getTopTags();

    return <section className="custom-scrollbar background-light900_dark200
    light-border righ-0 sticky top-0 flex h-screen w-[350px] flex-col gap-6
    overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
        <div>
            <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
            <DataRenderer success={success} data={hotQuestions} error={error} empty={{
                title:"No Questions Found",
                message:"No questions have been asked yet",
            }} render={(hotQuestions)=>(
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    {hotQuestions.map(({_id, title})=>(

                                <Link key={_id} href={ROUTES.QUESTION(_id)} className="flex
                    cursor-pointer items-center justify-between gap-7">
                                    <p className="body-medium text-dark500_light700 line-clamp-2">{title}</p>

                                    <Image src="/icons/chevron-right.svg" alt="Chevron" width={20} height={20} className="invert-colors"/>

                                </Link>

                    ))}
                </div>

            )}/>
        </div>
        <div className="mt-16">
            <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
            <DataRenderer success={tagSuccess} data={tagss} error={tagError} empty={{
                title:"No Tags Found",
                message:"No tags yet",
            }} render={(tags)=>(
                <div className="mt-7 flex flex-col gap-4">
                    {tags.map(({_id, name, questions}) => (
                        <TagCard key={_id} _id={_id} name={name} questions={questions} showCount compact/>
                    ))}

                </div>


            )}/>


        </div>
    </section>




}

export default RightSideBar
