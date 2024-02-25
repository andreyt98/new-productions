import { apiUrl, API_KEY } from "./api.config";

export const fetchData = async (obj) => {

  const {mediaType, category, limit  } = obj;

  const trendingUrl = `${apiUrl}${category[0]}/${mediaType}/day?api_key=${API_KEY}&page=1`
  const popularUrl = `${apiUrl}${mediaType}/${category[1]}?api_key=${API_KEY}&page=1`
  
  const trendingData = await fetch(trendingUrl);
  const popularData = await fetch(popularUrl);

  const jsonTrendingRequest = await trendingData.json();
  const jsonPopularRequest = await popularData.json();

  if(trendingData.ok && popularData.ok){

    const jsonTrendingResults = jsonTrendingRequest.results.slice(0, mediaType == 'movie' ? limit[0] : limit[2])
    const jsonPopularResults = jsonPopularRequest.results.slice(0, limit[1])

    const dataArray = []
    dataArray.push(jsonTrendingResults, jsonPopularResults)

    return dataArray

  }else{
    return []; 
  }
};