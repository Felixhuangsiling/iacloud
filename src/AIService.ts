import { predictionDTO, WaterCropPredictionPayload, WaterCropPredictionV1Data, WaterCropPredictionV2Data } from "./data";
import { useState } from "react";
import * as process from "node:process";

export function useAiPrediction() {

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const getAiPrediction = async (image: File) => {
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
const transformDataToJson = (data: WaterCropPredictionV1Data | WaterCropPredictionV2Data) => {
    return {
        Inputs: {
            input1: [
                {
                    "CROP TYPE": data.cropType,
                    "SOIL TYPE": data.soilType,
                    "REGION": data.region,
                    "TEMPERATURE": data.temperature,
                    "WEATHER CONDITION": data.weatherCondition
                }
            ]
        }
    };
};
export function useWatterCropPrediction() {

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const getAiPredictionV1 = async (data: WaterCropPredictionV1Data) => {
        setIsLoading(true);
        console.log(data);
        const transformedData = transformDataToJson(data);

        try {
            const response = await fetch("http://api-ai-cloud.azure-api.net/mlrequest/", {
                method: "POST",
                // mode: "no-cors",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_ML_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transformedData),
            });

            const res: any = await response.json();
            // console.log("res", res["Results"]["WebServiceOutput0"][0]["Water Consumption Prediction"]);
            setIsLoading(false);
            return res["Results"]["WebServiceOutput0"][0]["Water Consumption Prediction"];
        }
        catch (e) {
            console.log(e);
            setIsLoading(false);
            return null;
        }
    }

    const getAiPredictionV2 = async (data: WaterCropPredictionV2Data) => {
        setIsLoading(true);
        const transformedData = transformDataToJson(data);
        try {
            const response = await fetch("https://api-ai-cloud.azure-api.net/avg/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_ML_TOKEN_AVG}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transformedData),
            });

            const res: any = await response.json();
            setIsLoading(false);
            return res.Results.WebServiceOutput0[0]["Scored Labels"];
        }
        catch (e) {
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
