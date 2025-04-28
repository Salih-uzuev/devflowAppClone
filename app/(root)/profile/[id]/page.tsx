import React from 'react'
import {getUser, getUserQuestions, getUsersAnswers, getUserTopTags} from "@/lib/actions/user.action";
import {RouteParams} from "@/types/global";
import {notFound} from "next/navigation";
import {auth} from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import ProfileLink from "@/components/user/ProfileLink";
import dayjs from "dayjs";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import Stats from "@/components/user/Stats";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import DataRenderer from "@/components/DataRenderer";
import {EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS} from "@/constans/states";
import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/Pagination";
import AnswerCard from "@/components/cards/AnswerCard";
import TagCard from "@/components/cards/TagCard";

const Profile = async ({params, searchParams}:RouteParams) => {

    // /123123123
    const {id} = await params;
    // ?id=1&page=1&pageSize=10
    const {page, pageSize} = await searchParams;

    if(!id) notFound();

    const loggedInUser = await auth();

    const {success, data, error} = await getUser({
        userId:id,
    });
    if(!success) return(
        <div>
            <div className="h1-bold text-dark100_light900">{error?.message}</div>
        </div>
    );

    const {user, totalQuestion, totalAnswers} = data!;

    const {
        success: userQuestionSuccess,
        data:userQuestionsData,
        error:userQuestionError

    } = await getUserQuestions({
        userId:id,
        page:Number(page) || 1,
        pageSize: Number(pageSize) || 5
    })

    const {questions, isNext: hasMoreQuestions} = userQuestionsData!;

    const {
        success: userAnswersSuccess,
        data:userAnswersData,
        error:userAnswersError

    } = await getUsersAnswers({
        userId:id,
        page:Number(page) || 1,
        pageSize: Number(pageSize) || 5
    })

    const {answers, isNext: hasMoreAnswers} = userAnswersData!;

    const {
        success: userTopTagsSuccess,
        data:userTopTagsData,
        error:userTopTagsError

    } = await getUserTopTags({
        userId:id,

    })

    const {tags} = userTopTagsData!;



    const {_id, name,image,portfolio,location,createdAt,username,bio} = user;

    console.log({
        loggenInUserId:loggedInUser?.user?.id,
        id,
    })

    return (
        <>
        <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
            <div className="flex flex-col items-start gap-4 lg:flex-row">
                <UserAvatar id={_id}
                            name={name}
                            imageUrl={image}
                            className="size-[140px] rounded-full object-cover"
                            fallbackClassName="text-6xl font-bolder"
                />
                <div className="mt-3">
                    <h2 className="h2-bold text-dark100_light900">{name}</h2>
                    <p className="paragraph-regular text-dark200_light800">@{username}</p>
                    <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
                        {portfolio && (
                            <ProfileLink
                            imgUrl="/icons/link.svg"
                            href={portfolio}
                            title="Portfolio"
                            />
                        )}
                        {location && (
                            <ProfileLink
                                imgUrl="/icons/location.svg"
                                title="Location"
                            />
                        )}

                            <ProfileLink
                                imgUrl="/icons/calendar.svg"

                                title={dayjs(createdAt).format("MMMM D, YYYY")}
                            />

                    </div>
                    {bio && (
                        <p className="paragraph-regular text-dark400_light800 mt-8" >{bio}</p>
                    )}
                </div>
            </div>
            <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
                {loggedInUser?.user?.id === id &&(
                    <Link href={`/profile/edit/${id}`}>
                        <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3">Edit Profile</Button>
                    </Link>
                )}

            </div>
        </section>
            <Stats
                totalQuestion={totalQuestion}
                totalAnswers={totalAnswers}
                badges={{
                    gold:0,
                    bronze:0,
                    silver:0
                }}
            />

            <section className="mt-10 flex gap-10">
                <Tabs defaultValue="top-posts" className="flex-[2]">
                    <TabsList className="background-light800_dark400 min-h-[42px] p-1">
                        <TabsTrigger value="top-posts" className="tab">Top Posts</TabsTrigger>
                        <TabsTrigger value="answers" className="tab">Answers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="top-posts" className="mt-5 flex w-full flex-col gap-6">
                        <DataRenderer success={userQuestionSuccess} data={questions} error={userQuestionError} empty={EMPTY_QUESTION} render={(questions)=>(

                                <div className="flex w-full flex-col gap-6">
                                    {questions.map((questions)=>(
                                        <QuestionCard question={questions} key={questions._id} showActionBtns={loggedInUser?.user?.id === questions.author._id}/>
                                    ))}

                                </div>

                        )}/>
                        <Pagination page={page} isNext={hasMoreQuestions}/>
                    </TabsContent>



                    <TabsContent value="answers" className="flex w-full flex-col gap-10">
                        <DataRenderer success={userAnswersSuccess} data={answers} error={userAnswersError} empty={EMPTY_ANSWERS} render={(answers)=>(

                            <div className="flex w-full flex-col gap-6">
                                {answers.map((answer)=>(
                                    <AnswerCard key={answer._id} {...answer} showActionBtns={loggedInUser?.user?.id === answer.author._id} content={answer.content.slice(0,27)} showReadMore containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"/>
                                ))}

                            </div>

                        )}/>
                        <Pagination page={page} isNext={hasMoreAnswers}/>
                    </TabsContent>

                </Tabs>

                <div className="flex min-h-[250px] w-full flex-1 flex-col max-lg:hidden">
                    <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
                    <div className="mt-7 flex flex-col gap-4">
                        <DataRenderer success={userTopTagsSuccess} data={tags} error={userTopTagsError} empty={EMPTY_TAGS} render={(tags)=>(

                            <div className="mt-3 flex w-full flex-col gap-4">
                                {tags.map((tag)=>(
                                   <TagCard key={tag._id} _id={tag._id} name={tag.name} questions={tag.count} showCount compact/>
                                ))}

                            </div>

                        )}/>
                    </div>

                </div>

            </section>
        </>
    )


}
export default Profile
