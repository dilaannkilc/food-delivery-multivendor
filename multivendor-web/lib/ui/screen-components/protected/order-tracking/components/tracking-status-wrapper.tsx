import React, { useEffect, useState } from "react";
import axios from "axios";
import { IOrderTrackingDetail } from "@/lib/utils/interfaces/order-tracking-detail.interface";
import TrackingStatusCard from "./tracking-status-card";

interface TrackingStatusWrapperProps {
  orderId: string;
}

const TrackingStatusWrapper = ({ orderId }: TrackingStatusWrapperProps) => {
  const [trackingDetails, setTrackingDetails] = useState<IOrderTrackingDetail | null>(null);

  const fetchTrackingDetails = async () => {
    try {
      const response = await axios.get<IOrderTrackingDetail>(`/api/order-tracking/${orderId}`);
      setTrackingDetails(prev => {

        if (JSON.stringify(prev) !== JSON.stringify(response.data)) {
          return response.data;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching tracking details:", error);
    }
  };

  useEffect(() => {
    fetchTrackingDetails(); 
    const interval = setInterval(fetchTrackingDetails, 30000); 
    return () => clearInterval(interval); 
  }, [orderId]);

  if (!trackingDetails) return <div>Loading tracking info...</div>;

  return <TrackingStatusCard orderTrackingDetails={trackingDetails} />;
};

export default TrackingStatusWrapper;
