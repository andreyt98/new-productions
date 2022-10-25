import { apiUrl, API_KEY } from "./api.config";

export const fetchData = async ({category, mediaType, limit })=>{

    const data = await fetch(`${apiUrl}${category}/${mediaType}/day?api_key=${API_KEY}&page=1`);
    const json = await data.json();

    if(limit === undefined) {limit = json.results.length}

    return json.results.slice(0,limit);
}


