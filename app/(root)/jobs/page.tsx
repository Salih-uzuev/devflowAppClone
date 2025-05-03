
import React from 'react'
import DataRenderer from "@/components/DataRenderer";
import JobCard from "@/components/cards/JobCard";
import {getJobs} from "@/lib/actions/jobs.action";








const Jobs = async () => {
    const {success, data, error} = await getJobs()

    return <>
        <h1 className="h1-bold text-dark100_light900 ">Find Jobs</h1>

        <div>
            <DataRenderer
                success={success}
                data={data}
                error={error}
                empty={{
                    title: "İlan Bulunamadı",
                    message: "Şu anda bu kriterlerde bir iş ilanı yok.",
                }}
                render={(jobs) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-11">
                        {jobs.map((job: any) => (
                            <JobCard key={job.job_id} job={job} />
                        ))}
                    </div>
                )}
            />


        </div>


    </>
}

export default Jobs

