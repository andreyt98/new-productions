import { apiUrl,API_KEY } from "./api.config"

export const search = async (query) => {

   const data =  await fetch(`${apiUrl}search/multi?api_key=${API_KEY}&query=${query}`);
    const json = await data.json();

    return json;
}