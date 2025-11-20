"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Prediction } from "@/lib/predictions";
import api from "@/app/api/api";
import { useState, useEffect } from "react";

interface PredictionsTableProps {
  predictions: Prediction[];
  showType?: boolean;
  onStatusChange?: (
    predictionId: string,
    status: "pending" | "won" | "lost"
  ) => void;
  isAdmin?: boolean;
}

export function PredictionsTable({
  predictions,
  showType = false,
  onStatusChange,
  isAdmin = false,
}: PredictionsTableProps) {
  const [localPredictions, setLocalPredictions] = useState(predictions);

  // Keep local state in sync when parent updates predictions prop
  useEffect(() => {
    setLocalPredictions(predictions);
  }, [predictions]);

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/prediction/${id}`);
      if (res.status === 200) {
        // Remove deleted item from local state
        setLocalPredictions((prev) => prev.filter((p) => p._id !== id));
        console.log("✅ Prediction deleted successfully");
      }
    } catch (error) {
      console.error("❌ Failed to delete prediction:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-500/20 text-green-400 hover:bg-green-500/30";
      case "lost":
        return "bg-red-500/20 text-red-400 hover:bg-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30";
      default:
        return "bg-foreground/10 text-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "premium"
      ? "bg-purple-500/20 text-purple-400"
      : "bg-blue-500/20 text-blue-400";
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-foreground/5">
            <TableHead>Match</TableHead>
            <TableHead>Bet</TableHead>
            <TableHead>Odds</TableHead>
            {showType && <TableHead>Type</TableHead>}
            <TableHead>Status</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {localPredictions.map((prediction, index) => (
            <TableRow
              key={prediction._id ?? index}
              className="hover:bg-foreground/5"
            >
              <TableCell className="font-medium">{prediction.match}</TableCell>
              <TableCell>{prediction.bet}</TableCell>
              <TableCell>
                {prediction.odds !== undefined
                  ? prediction.odds.toFixed(2)
                  : "-"}
              </TableCell>

              {showType && (
                <TableCell>
                  <Badge className={getTypeColor(prediction.type)}>
                    {prediction.type}
                  </Badge>
                </TableCell>
              )}

              <TableCell>
                {(() => {
                  const statusRaw = (
                    prediction.status || "pending"
                  ).toLowerCase();
                  const status = statusRaw === "lose" ? "lost" : statusRaw;

                  return isAdmin ? (
                    <select
                      value={status}
                      onChange={(e) =>
                        onStatusChange?.(
                          prediction._id,
                          e.target.value as "pending" | "won" | "lost"
                        )
                      }
                      className={`px-3 py-1 bg-slate-500 rounded font-medium text-sm cursor-pointer border-0 ${getStatusColor(
                        status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  ) : (
                    <Badge className={getStatusColor(status)}>{status}</Badge>
                  );
                })()}
              </TableCell>

              {isAdmin && (
                <TableCell>
                  <button
                    onClick={() => handleDelete(prediction._id)}
                    className="text-primary hover:underline text-sm"
                  >
                    Delete
                  </button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
