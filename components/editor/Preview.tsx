import { MDXRemote } from "next-mdx-remote/rsc";
import {Code} from "bright";

Code.theme = {
    light: "github-light",
    dark: "github-dark",
    lightSelector: "html.light",
};



export const Preview = ({ content }: { content: string }) => {
    const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");
    console.log(formattedContent);

    return (
        <section className="markdown prose grid break-words">
            <MDXRemote
                source={formattedContent}
                components={{
                    pre: (props) => (
                        <Code
                            {...props}
                            lineNumbers
                            className="shadow-light-200 dark:shadow-dark-200"
                        />
                    ),
                }}
            />
        </section>
    );
};