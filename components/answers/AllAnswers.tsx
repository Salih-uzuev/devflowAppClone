import React from 'react'
import {ActionResponse, Answer} from "@/types/global";
import DataRenderer from "@/components/DataRenderer";
import {EMPTY_ANSWERS} from "@/constans/states";
import AnswerCard from "@/components/cards/AnswerCard";
import CommonFilter from "@/components/filters/CommonFilter";
import {AnswerFilters} from "@/constans/filters";

interface Props extends ActionResponse<Answer[]>{
    totalAnswers:number;

}


const AllAnswers = ({data,success,error,totalAnswers}: Props) => {
    return <div className="mt-11">
        <div className="flex items-center justify-between">
            <h3 className="primary-text-gradient">{totalAnswers} {totalAnswers===1?"Answer" : "Answers"}</h3>
            <CommonFilter filters={AnswerFilters} otherClasses="sm:min-w-32" containerClasses="max-xs:w-full"/>
        </div>

        <DataRenderer success={success} data={data} error={error} empty={EMPTY_ANSWERS}

                      render={(answers)=>answers.map((answer)=>(
                          <AnswerCard key={answer._id} {...answer} />
                      ))}/>

    </div>
}
export default AllAnswers
