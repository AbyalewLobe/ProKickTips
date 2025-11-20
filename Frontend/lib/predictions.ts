import axios from "axios";

// types/predictions.ts
export interface Prediction {
  _id: string;
  user:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  match: string;
  bet: string;
  odds: number;
  type: "Free" | "Premium"; // match backend
  status: "Pending" | "Won" | "Lose"; // match backend
  createdAt: string;
  updatedAt: string;
}

// DTO for creating a prediction
export interface CreatePredictionDTO {
  match: string;
  bet: string;
  odds: number;
  type: "Free" | "Premium";
  status?: "Pending"; // optional
}

export async function getPredictions(
  tier: "Free" | "Premium"
): Promise<Prediction[]> {
  try {
    const res = await axios.get("/predictions");
    let predictions: Prediction[] = res.data.data || [];

    // Filter by tier if needed
    predictions = predictions.filter((p) => p.type === tier);

    return predictions;
  } catch (err) {
    console.error("Failed to fetch predictions", err);
    return [];
  }
}
