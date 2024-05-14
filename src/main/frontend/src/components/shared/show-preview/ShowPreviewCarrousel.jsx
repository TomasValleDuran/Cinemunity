import React from 'react';
import ShowPreview from './ShowPreview';
import './ShowPreviewCarrousel.css';

const PreviewCarousel = ({ posts }) => {
    return (
        <div className={'preview-carrousel'}>
            {posts.map(post => (
                <ShowPreview key={post.showId} id={post.showId} title={post.title}
                             image={post.image} rating={post.rating} reviews={post.reviews}
                />
            ))}
        </div>
    );
};

export default PreviewCarousel;