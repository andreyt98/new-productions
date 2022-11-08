import { apiUrl, API_KEY } from "./api.config";

export const getProvider = async (id, mediaType) => {
  const data = await fetch(`${apiUrl}${mediaType}/${id}/watch/providers?api_key=${API_KEY}`);
  const json = await data.json();

  return json;
};
