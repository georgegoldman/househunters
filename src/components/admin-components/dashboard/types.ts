export interface DashboardStats {
  totalProperties: number;
  propertiesSold: number;
  reviewsNeedingReply: number;
  pendingCustomers: number;
  growthRate: number;
  propertyBreakdown: {
    sold: number;
    requestedReview: number;
    rented: number;
    forSale: number;
  };
}

export interface Activity {
  id: number;
  activityType: string;
  propertyName: string;
  description: string;
  adminName: string;
  timestamp: string;
  status: string;
}
