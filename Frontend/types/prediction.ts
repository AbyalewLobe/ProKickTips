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
  type: "Free" | "Premium";
  status: "Pending" | "Won" | "Lose";
  createdAt: string;
  updatedAt: string;
}

export type CreatePredictionDTO = {
  match: string;
  bet: string;
  odds: number;
  type: "Free" | "Premium";
  status?: "Pending"; // optional because backend sets default
};
