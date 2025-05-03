"use server"

export const getJobs = async ()=>{

    try {
        const response = await fetch('https://jsearch.p.rapidapi.com/search?query=developer%20jobs%20in%20chicago&page=1&num_pages=1&country=us&date_posted=all', {
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY!,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
            }
        })
        const json = await response.json();
        return {success: true, data: json.data || []}
    } catch (error) {
    if (error instanceof Error) {
        return {success: false, error: error.message}
    }
    }
}