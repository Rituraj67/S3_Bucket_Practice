import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';
import axios from 'axios';

//nothing
// Mock API function to simulate fetching images from backend
const fetchImages = async () => {
  
  const res= await axios.get(import.meta.env.VITE_BASEADDRESS +"getimg");

  return res.data
};

export default function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const fetchedImages = await fetchImages();
      setImages(fetchedImages);
    };
    loadImages();
  }, []);

  const handleImageUpload = (newImage) => {
    setImages(prevImages => [...prevImages, { id: Date.now(), url: newImage }]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 flex-grow">
        <ImageUpload onImageUpload={handleImageUpload} />
        <ImageGallery images={images} />
      </div>
    </div>
  );
}

