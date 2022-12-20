import { apiUrl, API_KEY } from "./api.config";

export const getById = async (mediaType,id) => {
  const data = await fetch(`${apiUrl}${mediaType}/${id}?api_key=${API_KEY}`);
  const json = await data.json();

  return json;
};