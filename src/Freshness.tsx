// src/ImageUpload.tsx
import React, { useState, ChangeEvent } from 'react';

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  // Handle file change event
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2>Image Upload</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {previewURL && (
        <div>
          <h3>Image Preview:</h3>
          <img
            src={previewURL}
            alt="Preview"
            style={{ width: '300px', marginTop: '10px' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
