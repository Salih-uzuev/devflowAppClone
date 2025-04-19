"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import {useRef, useState, useTransition} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { AnswerSchema } from "@/lib/validations";
import {createAnswer} from "@/lib/actions/answer.action";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";
import {api} from "@/lib/api";

const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
});

interface Props{
    questionId:string
    questionTitle:string
    questionContent:string
}

const AnswerForm = ({questionId, questionTitle, questionContent}:Props) => {
    const [isAnswering, strtAnweringTransition] = useTransition();
    const [isAISubmitting, setIsAISubmitting] = useState(false);
    const session = useSession();
    const editorRef = useRef<MDXEditorMethods>(null);

    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {
            content: ""
        },
    });

    const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
        strtAnweringTransition(async ()=>{
            const result = await createAnswer({
                questionId,
                content: values.content
            });
            if(result.success){
                form.reset();

                toast({
                    title:"Success",
                    description:"Answer has been created successfully",
                });

                if(editorRef.current){
                    editorRef.current.setMarkdown("");
                }
            }else {
                toast({
                    title:`Error ${result.status}`,
                    description:result.error?.message,
                    variant: "destructive",
                })
            }

        })


    };

    const generateAIAnswer = async ()=>{
        if(session.status !== "authenticated") {
            return toast({
                title: "Error",
                description: "You are not logged in",
                variant: "destructive"
            });
        }

            setIsAISubmitting(true);

            const userAnswer = editorRef.current?.getMarkdown();
            try {
               const{success,data, error} = await api.ai.getAnswer(questionTitle,questionContent, userAnswer)
                if(!success){
                    toast({
                        title:"Error",
                        description:error?.message,
                        variant:"destructive"
                    })
                }

                const formattedAnswer = data.replace(/<br>/g, "\n").toString().trim()
                if(editorRef.current) {
                    editorRef.current.setMarkdown(formattedAnswer);
                    form.setValue('content', formattedAnswer);
                    form.trigger("content")
                }

                toast({
                    title:"Success",
                    description:"AI Answer has been generated successfully",
                })



            }catch (error) {
                toast({
                    title:"Error",
                    description:(error instanceof Error ? error.message : "Something went wrong"),
                    variant:"destructive"
                })
            }finally {
                setIsAISubmitting(false);
            }

    }

    return (
        <div>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
                <Button className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500" disabled={isAISubmitting}
                        onClick={generateAIAnswer} >

                    {isAISubmitting ? (<>
                        <ReloadIcon className="mr-2 size-4 animate-spin" />
                        Generating...
                    </>
                    ): <>
                    <Image src="/icons/stars.svg" alt="Generate AI Answer" width={12} height={12} className="object-contain" />
                        Generate AI Answer
                    </>
                    }

                </Button>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="mt-6 flex w-full flex-col gap-10"
                >
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-3">
                                <FormControl className="mt-3.5">
                                    <Editor
                                        value={field.value}
                                        editorRef={editorRef}
                                        fieldChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" className="primary-gradient w-fit">
                            {isAnswering ? <>
                                <ReloadIcon className="mr-2 size-4 animate-spin" />
                                Posting...
                            </> : "Post Answer"}

                        </Button>

                    </div>

                </form>

            </Form>

        </div>

    );
};

export default AnswerForm
