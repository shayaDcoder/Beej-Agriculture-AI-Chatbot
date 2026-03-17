import React from 'react';

function ImageResponse({ src, alt }) {
  return (
    <div className="image-response">
      <img src={src} alt={alt} />
    </div>
  );
}

export default ImageResponse;
