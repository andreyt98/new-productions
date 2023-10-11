import { apiUrl, API_KEY } from "./api.config";

export const fetchData = async ({ mediaType, category, limit }) => {
  const path = category === "trending" ? `${category}/${mediaType}/day` : `${mediaType}/${category}/`;
  const data = await fetch(`${apiUrl}${path}?api_key=${API_KEY}&page=1`);
  const json = await data.json();

  if (data.ok) {
    if (limit === undefined) limit = json.results.length;
    
    return json.results.slice(0, limit);

  } else {
    return []; 
  }
};