import { useContext,useState } from 'react';
import SliderCard from '../../components/SliderCard';
import { Context } from '../../context/Context';
import CircularProgress from '@mui/material/CircularProgress';
import { search } from '../../helpers/search';
import { useNavigate } from 'react-router-dom';

const SearchSection = () => {
  const { openTrailer, searchResults, setSearchResults } = useContext(Context);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  function handleSearch(event) {
    event.preventDefault();
    if (inputValue.trim().length === 0) {
      return;
    }
    setSearchResults([]);
    setSearchStarted(true);

    setLoadingSearch(true);

    search(inputValue).then((data) => {
      setSearchResults(data.results);
      setLoadingSearch(false);
    });
  }

  return (
    <section className={`search-section ${openTrailer && 'on-trailer'}`}>
      <div className='form-bg'>
        <i
          className='bi bi-arrow-left'
          onClick={() => {
            navigate(-1);
            window.scrollTo(0, 0);
          }}
        ></i>
        <form
          className='searchForm'
          onSubmit={(event) => {
            handleSearch(event);
          }}
        >
          <input
            type='search'
            placeholder='Search for a movie or tv show...'
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
          />
          <button type='submit'>
            <i className='bi bi-search'></i>
          </button>
        </form>
      </div>
      {loadingSearch ? (
        <CircularProgress color='inherit' size={100} style={{ marginTop: '100px' }} />
      ) : (
        <>
          <div className='results'>
            {searchResults.length > 0
              ? searchResults.map((result) => {
                  if (result.media_type !== 'person' && result.media_type) {
                    return <SliderCard result={result} changeMediaType={result.media_type} />;
                  }
                })
              : searchStarted && <p style={{ gridColumn: '1/-1' }}>no results</p>}
          </div>
        </>
      )}
    </section>
  );
};

export default SearchSection;
