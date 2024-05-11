export const selectedMedia_InitialState = {
  results:[],
  heroBackground:'',
  title:'',
  poster:'',
  overview:'',
  releaseDate:'',
  vote:'',
  genres:[],
  loadingAllData:true,
  loadingFavs:true,
  loadingWatchlist:true,
  loadingCast:true
}

export const selectedM_Actions = {
  set_Media_Values: 'set_Media_Values',
}

export const reducerFunction = (state, action) => {
  switch(action.type){
   
    case selectedM_Actions.set_Media_Values:
      return{
        ...state,
        results:action.payload.results,
        heroBackground:action.payload.heroBackground,
        title:action.payload.title,
        poster:action.payload.poster,
        overview:action.payload.overview,
        releaseDate:action.payload.releaseDate,
        vote:action.payload.vote,
        genres:action.payload.genres,
        loadingAllData: action.payload.loadingAllData
      }

    default:
      break;
    
  }
}