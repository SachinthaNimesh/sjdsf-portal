import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "negative-emotion" | "check-in-gap" | "incident-report";
  title: string;
  date: string;
  studentId: string;
  studentName: string;
}

export const NotificationsPopover = () => {
  // Sample notifications data
  const notifications: Notification[] = [
    {
      id: "1",
      type: "negative-emotion",
      title: "Negative Emotion Trend",
      date: "2023-03-11 | 1:45 PM",
      studentId: "02",
      studentName: "Malini Silva",
    },
    {
      id: "2",
      type: "check-in-gap",
      title: "3-day check in gap",
      date: "2023-03-11 | 10:00 AM",
      studentId: "03",
      studentName: "Rajiv Kumar",
    },
    {
      id: "3",
      type: "incident-report",
      title: "Incident Report",
      date: "2023-03-06 | 2:40 PM",
      studentId: "01",
      studentName: "Sampath Perera",
    },
    {
      id: "4",
      type: "check-in-gap",
      title: "3-day check in gap",
      date: "2023-03-11 | 8:45 AM",
      studentId: "04",
      studentName: "Asanka Bandara",
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 bg-white p-0 shadow-lg rounded-lg"
        align="end"
      >
        <div className="bg-blue-300/40 rounded-t-lg p-4">
          <h3 className="text-lg font-medium text-gray-800">Notifications</h3>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 border-b border-gray-100">
              <div className="flex justify-between mb-1">
                <h4 className="font-medium text-gray-800">
                  {notification.title}
                </h4>
                <span className="text-xs text-gray-500">
                  {notification.date}
                </span>
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  Employee ID: {notification.studentId}
                </p>
                <p className="text-sm text-gray-600">
                  Employee Name: {notification.studentName}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  Action Taken
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  No Action Needed
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
