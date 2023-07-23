import { useEffect, useState } from 'react';
import { getById } from '../helpers/getById';
import { Context } from '../context/Context';
import { useContext } from 'react';
import { image } from '../helpers/api.config';
import { useNavigate } from 'react-router-dom';
const Info = ({ mediaType }) => {
  const navigate = useNavigate()
  const [heroBackground, setHeroBackground] = useState('');
  const [results, setResults] = useState([]);
  const { currentId } = useContext(Context);
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [releaseDate, setReleaseDate] = useState();
  const [vote, setVote] = useState(0);
  const [genres, setGenres] = useState([]);
  // const [provider, setProvider] = useState('');
  const [id, setId] = useState('');
  // const [trailerKey, setTrailerKey] = useState('');
  // const [openTrailer, setOpenTrailer] = useState('');

  useEffect(() => {
    getById(mediaType, currentId).then((data) => {
      // console.log(data);
      const { id, title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path } = data;

      setResults({ id, title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path });

      setId(id);
      setTitle(title || original_name);
      setOverview(overview);
      setReleaseDate(release_date.slice(0, 4) || first_air_date.slice(0, 4));
      setGenres(genres.map((genre) => genre.name));

      setVote(String(vote_average).slice(0, 1));
      setHeroBackground(`${image({ size: 1280 })}${backdrop_path}`);
    });
  }, []);

  function handleBackClick(){
    mediaType === 'movie' ? navigate('/movies') : navigate('/tvshows')
  }

  return (
    <section className='info-component'>
      <i className="bi bi-arrow-left-circle-fill" onClick={handleBackClick}></i>
      <div className='hero2' style={{backgroundImage: `url(${heroBackground})`}}>
        <div className='overlay'></div>
        {/* <img src={heroBackground} alt='' /> */}
        <i
          className='bi bi-play-circle-fill'
          data-id={2}
          onClick={() => {
            // handleTrailerClick(result.id);
          }}
        ></i>{' '}
      <div className='main'>
        <h2>{title + ` (${vote})`}</h2>
        <div className='main__header'>
          <div className='info'>
            <span>
              {releaseDate + ' •' + ' '}

              {genres.join(', ', (genre) => {
                return <span>{genre}</span>;
              })}
            </span>

            <p>{overview}</p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Info;
