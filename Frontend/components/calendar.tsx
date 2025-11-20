"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DatePickerProps {
  selectedDate?: Date;
  setSelectedDate: (date?: Date) => void;
}

export default function DatePicker({
  selectedDate,
  setSelectedDate,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full text-left px-3 py-2 text-sm bg-card text-foreground border border-border rounded-md"
        >
          {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Select a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date || undefined)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
