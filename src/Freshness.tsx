// src/ImageUpload.tsx
import React, { useState, ChangeEvent } from "react";
import IAService from "./AIService";
import { predictionDTO } from "./data";
const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  // Handle file change event
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
      setResult(null);
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
            style={{ width: "300px", marginTop: "10px" }}
          />
          <div>
            <button
              onClick={async () => {
                if (image) {
                  const result = await IAService.getAiPrediction(image);
                  setResult(result);
                }
              }}
            >
              Run Freshness Detector
            </button>
          </div>
          {result && (
            <div>
              The image is a {result[0]} with a probability of {result[1]}%
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
