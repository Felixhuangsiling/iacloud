import { predictionDTO } from "./data";

const IAService = {


    async getAiPrediction(image: File) {
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

        return [predictedTag, predictedTagProbability.toFixed(2)]
    }
}

export default IAService;
