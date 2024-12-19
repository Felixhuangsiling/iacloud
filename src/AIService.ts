import {predictionDTO, WaterCropPredictionPayload, WaterCropPredictionV1Data, WaterCropPredictionV2Data} from "./data";
import {useState} from "react";
import * as process from "node:process";

export function useAiPrediction() {

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const getAiPrediction = async(image: File) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("imageData", image);
        const response = await fetch("http://localhost:8080/image", {
            method: "POST",
            body: formData,
        });
        const data: predictionDTO = await response.json();

        var predictedTag = "null";
        var predictedTagProbability = 0;

        for (let index = 0; index < data.predictions.length; index++) {
            const prediction = data.predictions[index];
            if (prediction.probability > predictedTagProbability) {
                predictedTag = prediction.tagName
                predictedTagProbability = prediction.probability
            }
        }

        predictedTagProbability = predictedTagProbability * 100;
        setIsLoading(false);
        return [predictedTag, predictedTagProbability.toFixed(2)]
    }

    return {
        isLoading,
        getAiPrediction
    }
}

export function useWatterCropPrediction() {

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const getAiPredictionV1 = async(data: WaterCropPredictionV1Data) => {
        setIsLoading(true);
        try{
            const response = await fetch("http://f3e09381-e76c-4a5a-8b70-2440bbf71204.westeurope.azurecontainer.io/score", {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_ML_TOKEN}`,
                    "Prediction-Key": import.meta.env.VITE_ML_PREDICTION_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const res: WaterCropPredictionPayload = await response.json();
            setIsLoading(false);
            return res;
        }
        catch (e){
            console.log(e);
            setIsLoading(false);
            return null;
        }
    }

    const getAiPredictionV2 = async(data: WaterCropPredictionV2Data) => {
        setIsLoading(true);
        try{
            const response = await fetch("http://f3e09381-e76c-4a5a-8b70-2440bbf71204.westeurope.azurecontainer.io/score", {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_ML_TOKEN}`,
                    "Prediction-Key": import.meta.env.VITE_ML_PREDICTION_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const res: WaterCropPredictionPayload = await response.json();
            setIsLoading(false);
            return res;
        }
        catch (e){
            console.log(e);
            setIsLoading(false);
            return null;
        }
    }

    return {
        isLoading,
        getAiPredictionV1,
        getAiPredictionV2,
    }
}
