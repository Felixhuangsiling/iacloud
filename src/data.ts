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

