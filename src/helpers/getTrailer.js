import { apiUrl, API_KEY } from "./api.config";

export const getTrailer = async (id, mediaType) => {
  const data = await fetch(`${apiUrl}${mediaType}/${id}/videos?api_key=${API_KEY}`);
  const json = await data.json();

  return json;
};
