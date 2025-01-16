import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';


export default function ImageUpload({ onImageUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setimage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      setimage(file);
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('s3img', image);
    console.log(formData);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASEADDRESS}image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      if (selectedImage) {
        onImageUpload(selectedImage);
        setSelectedImage(null);
        setimage(null);
        inputRef.current.value= null
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        {selectedImage && (
          <div className="mt-4">
            <img src={selectedImage || "/placeholder.svg"} alt="Selected" className="max-w-xs rounded-lg shadow-md" />
          </div>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          disabled={!selectedImage || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Image'
          )}
        </button>
      </form>
    </div>
  );
}

