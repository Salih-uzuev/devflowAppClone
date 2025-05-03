import React from "react";

interface Job {
    job_id: string;
    job_title: string;
    employer_name: string;
    job_city?: string;
    job_country?: string;
    job_apply_link: string;
}

const JobCard = ({ job }: { job: Job }) => {
    return (
        <div className="border rounded-xl p-5 shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">

                {job.job_title}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-1">
                {job.employer_name}
            </p>

            {(job.job_city || job.job_country) && (
                <p className="text-sm text-gray-500 flex items-center gap-1">

                    {job.job_city}, {job.job_country}
                </p>
            )}

            <a
                href={job.job_apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:underline mt-4 text-sm"
            >
                View Job
            </a>
        </div>
    );
};

export default JobCard;
