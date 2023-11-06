import { apiUrl, API_KEY } from "./api.config";

export const getProvider = async (id, mediaType) => {
  const data = await fetch(`${apiUrl}${mediaType}/${id}/watch/providers?api_key=${API_KEY}`);
  const json = await data.json();

  return json;
};

export const assignProvider = async (id,currentMediaType,setProvider) => {
  try {
    const mediaType = currentMediaType == 'movies' ? 'movie' : 'tv'
    
    const providerResults = await getProvider(id, mediaType);

    const noProvider = Object.keys(providerResults.results).length < 1;
    if (noProvider) {
      setProvider('');
      return;
    }

    const { results } = providerResults;

    if (results) {
      Object.values(results).map((result) => {
        results.US ? setProviderFromUsa(results,setProvider) : setProvider(Object.values(result)[1][0].provider_name);
      });
    }
  } catch(e) {
    console.log('error on provider', e);
  }
};

const setProviderFromUsa = (results,setProvider) => {
  if (results.US.flatrate) {
    setProvider(Object.values(results.US.flatrate[0].provider_name));
  } else {
    setProvider(Object.values(results.US)[1][0].provider_name);
  }
};