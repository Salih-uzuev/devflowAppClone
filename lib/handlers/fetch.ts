import {ActionResponse} from "@/types/global";
import logger from "@/lib/logger";
import handleError from "@/lib/handlers/error";
import {RequestError} from "@/lib/http-errors";

interface FetchOptions extends RequestInit {
    timeout?: number;
}

function isError(error:unknown): error is Error{
    return error instanceof Error;
}

export async function fetchHandler<T>(
    url:string, options:FetchOptions = {}): Promise<ActionResponse<T>> {
    const {timeout = 25000, headers:customHeaders = {}, ...restOptions} = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const defaultHeader: HeadersInit ={
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const headers:HeadersInit = {
        ...defaultHeader,
        ...customHeaders,
    };

    const config:RequestInit = {
        ...restOptions,
        headers,
        signal: controller.signal,
    };

    try {
        const response = await fetch(url, config);
        clearTimeout(id);
        if(!response.ok){
            throw new RequestError(response.status, `HTTP error: ${response.statusText}`);
        }
        return await response.json();

    }catch (err) {
        const error = isError(err) ? err: new Error("Unknown error");

        if(error.name === 'AbortError') {
            logger.warn(`Request to ${url} timed out`);
        }else {
            logger.error(`Error fetching ${url} failed: ${error.message}`);
        }

        return handleError(error,'api') as unknown as ActionResponse<T>;

    }

}