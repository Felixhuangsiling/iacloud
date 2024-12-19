export interface predictionDTO {
    created_at: string;
    id: number;
    iteration: number;
    predictions: Array<prediction>;

}

interface prediction {
    boundingBox: string;
    probability: number;
    tagId: string;
    tagName: string;
}

export interface WaterCropPredictionV1Data {
    cropType: string,
    soilType: string,
    region: string,
    temperature: string,
    weatherCondition: string,
}

export interface WaterCropPredictionV2Data {
    cropType: string,
    soilType: string,
    region: string,
    temperature: number,
    weatherCondition: string,
}
interface WaterCropPrediction {
    "CROP TYPE": string,
    "SOIL TYPE": string,
    "REGION": string,
    "TEMPERATURE": string,
    "WEATHER CONDITION": string,
    "Scored Labels": number,
}

interface WaterCropPredictionRes {
    WebServiceOutput0: Array<WaterCropPrediction>
}

export interface WaterCropPredictionPayload {
    Results: WaterCropPredictionRes
}

