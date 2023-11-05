import { apiUrl, API_KEY } from "./api.config";

export const fetchData = async (obj) => {

  const {mediaType, category, limit  } = obj;
  const path1 = `${category[0]}/${mediaType}/day`;
  const path2 = `${mediaType}/${category[1]}`;

  const trendingData = await fetch(`${apiUrl}${path1}?api_key=${API_KEY}&page=1`);
  const popularData = await fetch(`${apiUrl}${path2}?api_key=${API_KEY}&page=1`);

  const json1 = await trendingData.json();
  const json2 = await popularData.json();

  if(trendingData.ok && popularData.ok){

    const jsonTrendingData = json1.results.slice(0, limit[0])
    const jsonPopularData = json2.results.slice(0, limit[1])

    const dataArray = []
    dataArray.push(jsonTrendingData, jsonPopularData)

    return dataArray

  }else{
    return []; 
  }
};