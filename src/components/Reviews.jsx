import { useState, useRef } from 'react';

export const Reviews = ({ reviews }) => {

  const reviewsContainerRef = useRef(null);
  const [reviewsMaximized, setReviewsMaximized] = useState(false);
  return (
    <>
      <h3 style={{ marginTop: '40px' }}>Reviews</h3>
      {reviews.length > 0 ? (
        <>
          <div className='reviews' ref={reviewsContainerRef} style={{ height: reviews.length < 2 ? '100%' : '350px', position: 'relative', zIndex: '1' }}>
            {reviews.map((result) => {
              return (
                <div className='review-content'>
                  <span className='fixed' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p id='author'>
                      {result.author_details.username}
                      <p style={{ color: 'white', opacity: '0.7', fontSize: '85%' }}>Rating: {result.author_details.rating}</p>
                    </p>
                    <p style={{ opacity: '0.7' }}>{result.created_at.slice(0, 10)}</p>
                  </span>

                  <p className='review-text'>{result.content}</p>
                </div>
              );
            })}

            <span
              style={{
                display: reviews.length < 2 || reviewsMaximized ? 'none' : 'block',
                zIndex: '2',
                height: '300px',
                width: '100%',
                position: 'absolute',
                bottom: '0',
                left: '0',
                background: reviews.length > 1 ? 'linear-gradient(transparent, #000000de, black)' : 'none',
              }}
            >
              <p
                onClick={() => {
                  (reviewsContainerRef.current.style.height = '100%'), setReviewsMaximized(true);
                }}
                style={{ textDecoration: 'underline', cursor: 'pointer', textAlign: 'center', position: 'absolute', bottom: '0', left: '50%', transform: 'translate(-50%)' }}
              >
                See all
              </p>
            </span>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>No reviews available</p>
      )}
    </>
  );
};
