import React from 'react';

export default function ImageGallery({ images }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Image Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.isArray(images) &&
          images.map((image, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md">
              <img
                src={typeof image === 'object' ? image.url : image} // Adjust if `image` is an object
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
