import qs from "query-string";

interface UrlQueryParams {
    params: string;
    key: string;
    value: string;
}

interface UrlQueryRemoveParams {
    params: string;
    keysToRemove: string[];
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
    const queryString = qs.parse(params);
    queryString[key] = String(value); // String’e zorla
    const query = qs.stringify(queryString, { skipNull: true });
    return `${window.location.pathname}${query ? `?${query}` : ""}`;
};

export const removeKeysFromUrl = ({ params, keysToRemove }: UrlQueryRemoveParams) => {
    const queryString = qs.parse(params);
    keysToRemove.forEach((key) => {
        delete queryString[key];
    });
    const query = qs.stringify(queryString, { skipNull: true });
    return `${window.location.pathname}${query ? `?${query}` : ""}`;
};