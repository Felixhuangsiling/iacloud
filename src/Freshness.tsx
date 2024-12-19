// src/ImageUpload.tsx
import React, { useState, ChangeEvent } from "react";
import {useAiPrediction} from "./AIService";
import {Divider, Button, Input, Card, CardHeader, CardBody, Image, CardFooter, Chip} from "@nextui-org/react";

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [result, setResult] = useState<Array<string | number> | null>(null);
  const [imageHistory, setImageHistory] = useState<Array<File>>();

  const aiPredictionController = useAiPrediction();

  // Handle file change event
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImageHistory([...(imageHistory || []), file]);
      setPreviewURL(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const onButtonPress = async () => {
      if (image) {
          const result = await aiPredictionController.getAiPrediction(image);
          setResult(result);
      }
  }

  return (
      <div className="flex flex-col justify-center items-center gap-10 m-20">
          <Card className="min-w-96 min-h-96">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                  <h4 className="font-bold text-large text-center">{previewURL ? "Prévisualisation" : "Veuillez choisir une image"}</h4>
              </CardHeader>
              <CardBody className="flex justify-center items-center">
                  {previewURL ? (<Image
                          alt="Card background"
                          className="object-cover rounded-xl m-auto"
                          src={previewURL}
                          width={200}
                          height={200}
                      />
                  ) : (
                      <div>

                      </div>
                  )}
              </CardBody>
              <CardFooter className="flex flex-col gap-4">
                  <Input type="file" accept="image/*" onChange={handleImageChange}/>
                  <Button color={"primary"} isLoading={aiPredictionController.isLoading} isDisabled={previewURL === null} onPress={onButtonPress}>
                      Calculer la fraicheur
                  </Button>
                  {result && (
                      <div class="flex flex-row gap-4 items-center">
                          <Chip color="default">Aliment: {result[0]}</Chip>
                          <Chip color="success">Fraicheur {result[1]}</Chip>
                      </div>
                  )}
              </CardFooter>
          </Card>
          <div className="flex flex-col items-center gap-4">
              <h4 className="font-bold text-large text-center">Historique des images</h4>
              <div className="flex flex-row snap-x scroll-smooth items-center">
                  {imageHistory &&
                      imageHistory.map((image, index) => (
                          <>
                              <div className="snap-center">
                                  <img
                                      onClick={() => {
                                          setPreviewURL(URL.createObjectURL(image));
                                          setImage(image);
                                          setResult(null);
                                      }}
                                      key={index}
                                      src={URL.createObjectURL(image)}
                                      alt="Preview"
                                      style={{width: "100px", marginRight: "10px"}}
                                  />
                              </div>
                                {index !== imageHistory.length - 1 && (
                                    <Divider orientation="vertical" className="mx-4" />
                                )}
                            </>
                      ))}
              </div>
          </div>
      </div>
  );
};

export default ImageUpload;
