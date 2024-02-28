import { API_KEY } from "./api.config";

export const getCast = async (mediaType,id) => {

    const cast = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${API_KEY}&language=en-US&page=1`)
    const castJson = await cast.json();

    if(cast.ok){
        return castJson.cast;
    }

    return [];  
}