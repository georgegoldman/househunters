import { useState, useRef, useEffect } from "react";
import UserIconSm from "../../../assets/user-icon-sm";
import MailIconSm from "../../../assets/mail-icon-sm";
import StarRating from "../../star-rating";
import CloseIcon from "../../../assets/close-icon";
import SendIcon from "../../../assets/send-icon";
import { api, type PropertyRequest, type PropertyReview, type RequestStatus, type ReviewStatus } from "../../../lib/api";

type TabType = "requests" | "reviews";

interface RequestData {
  id: string;
  status: "pending" | "replied" | "closed";
  date: string;
  propertyTitle: string;
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  additionalInfo?: string;
  specialRequirements?: string;
}

interface ReviewData {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  propertyTitle: string;
  reviewerName: string;
  reviewerEmail: string;
  status: "pending" | "approved" | "rejected" | "resolved";
  adminReply?: string;
}

interface QuickReply {
  id: string;
  text: string;
}

const QUICK_REPLIES: QuickReply[] = [
  {
    id: "1",
    text: "Thank you for your enquiry, we'll get back to you shortly.",
  },
  {
    id: "2",
    text: "This property is available will you like to schedule a viewing.",
  },
  {
    id: "3",
    text: "Unfortunately, this property is no longer available, can we suggest a similar listing?",
  },
];

const CustomerRequests = () => {
  const [activeTab, setActiveTab] = useState<TabType>("requests");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [replyText, setReplyText] = useState("");
  const [mobileFilter, setMobileFilter] = useState<RequestData["status"]>("pending");

  // New state for review mobile filter
  const [mobileReviewFilter, setMobileReviewFilter] = useState<ReviewData["status"]>("pending");

  const replyInputRef = useRef<HTMLInputElement | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  // State for API data
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // New state for request details modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PropertyRequest | null>(null);
  const [isCompletingRequest, setIsCompletingRequest] = useState(false);

  // Function to convert API data to component format
  const convertApiToRequestData = (apiRequest: PropertyRequest): RequestData => {
    const statusMap = {
      'PENDING': 'pending' as const,
      'CONFIRMED': 'replied' as const,
      'COMPLETED': 'closed' as const,
      'CANCELLED': 'closed' as const,
    };

    return {
      id: apiRequest.id,
      status: statusMap[apiRequest.status],
      date: new Date(apiRequest.createdAt).toLocaleDateString(),
      propertyTitle: apiRequest.property
        ? `${apiRequest.property.address}, ${apiRequest.property.city}`
        : `Property ID: ${apiRequest.propertyId}`,
      customerName: `${apiRequest.firstName} ${apiRequest.lastName}`,
      customerEmail: apiRequest.email,
      phoneNumber: apiRequest.phoneNumber,
      preferredDate: apiRequest.preferredDate,
      preferredTime: apiRequest.preferredTime,
      additionalInfo: apiRequest.additionalInfo,
      specialRequirements: apiRequest.specialRequirements,
    };
  };

  // Function to convert API review data to component format
  const convertApiToReviewData = (apiReview: PropertyReview): ReviewData => {
    const statusMap = {
      'PENDING': 'pending' as const,
      'APPROVED': 'approved' as const,
      'REJECTED': 'rejected' as const,
      'RESOLVED': 'resolved' as const,
    };

    return {
      id: apiReview.id,
      name: apiReview.reviewerName,
      rating: apiReview.rating,
      date: new Date(apiReview.createdAt).toLocaleDateString(),
      comment: apiReview.comment,
      propertyTitle: apiReview.property
        ? `${apiReview.property.address}, ${apiReview.property.city}`
        : `Property ID: ${apiReview.propertyId}`,
      reviewerName: apiReview.reviewerName,
      reviewerEmail: apiReview.reviewerEmail,
      status: statusMap[apiReview.status],
      adminReply: apiReview.adminReply,
    };
  };

  // Fetch requests from API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiRequests = await api.admin.propertyRequests.list();
      const convertedRequests = apiRequests.map(convertApiToRequestData);
      setRequests(convertedRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const apiReviews = await api.admin.propertyReviews.list();
      const convertedReviews = apiReviews.map(convertApiToReviewData);
      setReviews(convertedReviews);
    } catch (err) {
      setReviewsError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Load data on component mount and tab change
  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab]);

  // Handle closing a request
  const handleCloseRequest = async (requestId: string) => {
    try {
      await api.admin.propertyRequests.updateStatus(requestId, 'CANCELLED');
      await fetchRequests();
      setToast({ visible: true, message: "Request closed successfully" });
      setTimeout(() => setToast({ visible: false, message: "" }), 2500);
    } catch (err) {
      console.error('Error closing request:', err);
      setToast({ visible: true, message: "Failed to close request" });
      setTimeout(() => setToast({ visible: false, message: "" }), 2500);
    }
  };

  // Handle viewing a request - opens modal and updates to CONFIRMED
  const handleViewRequest = async (requestId: string) => {
    try {
      const fullRequest = await api.admin.propertyRequests.getById(requestId);

      if (fullRequest.status === 'PENDING') {
        const updatedRequest = await api.admin.propertyRequests.updateStatus(requestId, 'CONFIRMED');
        setSelectedRequest(updatedRequest);
        setToast({ visible: true, message: "Request confirmed" });
        setTimeout(() => setToast({ visible: false, message: "" }), 2500);
      } else {
        setSelectedRequest(fullRequest);
      }

      setIsRequestModalOpen(true);
      await fetchRequests();
    } catch (err) {
      console.error('Error fetching request details:', err);
      setToast({ visible: true, message: "Failed to load request details" });
      setTimeout(() => setToast({ visible: false, message: "" }), 2500);
    }
  };

  // Handle completing a request
  const handleCompleteRequest = async () => {
    if (!selectedRequest) return;

    try {
      setIsCompletingRequest(true);
      await api.admin.propertyRequests.updateStatus(selectedRequest.id, 'COMPLETED');
      setSelectedRequest(prev => prev ? { ...prev, status: 'COMPLETED' } : null);
      await fetchRequests();
      setToast({ visible: true, message: "Request completed successfully" });
      setTimeout(() => setToast({ visible: false, message: "" }), 2500);
    } catch (err) {
      console.error('Error completing request:', err);
      setToast({ visible: true, message: "Failed to complete request" });
      setTimeout(() => setToast({ visible: false, message: "" }), 2500);
    } finally {
      setIsCompletingRequest(false);
    }
  };

  // Handle review approval
  // const handleApproveReview = async (reviewId: string) => {
  //   try {
  //     await api.admin.propertyReviews.updateStatus(reviewId, 'APPROVED');
  //     await fetchReviews();
  //     setToast({ visible: true, message: "Review approved successfully" });
  //     setTimeout(() => setToast({ visible: false, message: "" }), 2500);
  //   } catch (err) {
  //     console.error('Error approving review:', err);
  //     setToast({ visible: true, message: "Failed to approve review" });
  //     setTimeout(() => setToast({ visible: false, message: "" }), 2500);
  //   }
  // };

  // Handle review rejection - commented out with reviews tab
  // const handleRejectReview = async (reviewId: string) => {
  //   try {
  //     await api.admin.propertyReviews.updateStatus(reviewId, 'REJECTED');
  //     await fetchReviews();
  //     setToast({ visible: true, message: "Review rejected successfully" });
  //     setTimeout(() => setToast({ visible: false, message: "" }), 2500);
  //   } catch (err) {
  //     console.error('Error rejecting review:', err);
  //     setToast({ visible: true, message: "Failed to reject review" });
  //     setTimeout(() => setToast({ visible: false, message: "" }), 2500);
  //   }
  // };

  // Handle marking review as resolved - commented out with reviews tab
  const handleMarkAsResolved = async (reviewId: string) => {
    try {
      await api.admin.propertyReviews.updateStatus(reviewId, 'RESOLVED');

      // Update the selected review if it's the current one
      if (selectedReview && selectedReview.id === reviewId) {
        setSelectedReview(prev => prev ? { ...prev, status: 'resolved' } : null);
      }

      await fetchReviews();
      setToast({ visible: true, message: "Review marked as resolved" });
      setTimeout(() => setToast({ visible: false, message: "" }), 2500);
    } catch (err) {
      console.error('Error marking review as resolved:', err);
      setToast({ visible: true, message: "Failed to mark review as resolved" });
      setTimeout(() => setToast({ visible: false, message: "" }), 2500);
    }
  };

  // Close request details modal
  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
    setSelectedRequest(null);
  };

  // Handle backdrop click for request modal
  const handleRequestModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeRequestModal();
  };

  // Review modal functions - commented out with reviews tab
  // const openReviewModal = (review: ReviewData) => {
  //   setSelectedReview(review);
  //   setReplyText(review.adminReply || "");
  //   setIsReviewModalOpen(true);
  // };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedReview(null);
    setReplyText("");
  };

  // Review backdrop click - commented out with reviews tab

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeReviewModal();
  };
  

  // Review quick reply - commented out with reviews tab
  const handleQuickReply = (text: string) => {
    setReplyText(text);
    setTimeout(() => replyInputRef.current?.focus(), 0);
  };
  

  // Review submit reply - commented out with reviews tab
  
  const handleSubmitReply = async () => {
    const text = replyText.trim();
    if (!text || isSending || !selectedReview) return;

    setIsSending(true);
    try {
      await api.admin.propertyReviews.addReply(selectedReview.id, text);

      // Update the selected review
      setSelectedReview(prev => prev ? { ...prev, adminReply: text, status: 'resolved' } : null);

      await fetchReviews();
      setToast({ visible: true, message: "Your reply has been sent" });
      closeReviewModal();
      setTimeout(() => setToast({ visible: false, message: "" }), 2500);
    } catch (err) {
      console.error('Error sending reply:', err);
      setToast({ visible: true, message: "Failed to send reply" });
      setTimeout(() => setToast({ visible: false, message: "" }), 2500);
    } finally {
      setIsSending(false);
    }
  };
  

  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitReply();
    }
  };

  const getStatusConfig = (status: RequestData["status"]) => {
    const configs = {
      pending: {
        bgColor: "bg-[#FE67001A]",
        borderColor: "border-[#FE670080]",
        textColor: "text-[#FE6700]",
        label: "Pending",
      },
      replied: {
        bgColor: "bg-[#0094421A]",
        borderColor: "border-[#00944299]",
        textColor: "text-[#009442]",
        label: "Confirmed",
      },
      closed: {
        bgColor: "bg-[#F931311A]",
        borderColor: "border-[#F9313180]",
        textColor: "text-[#F93131]",
        label: "Closed",
      },
    };
    return configs[status];
  };

  const getReviewStatusConfig = (status: ReviewData["status"]) => {
    const configs = {
      pending: {
        bgColor: "bg-[#FE67001A]",
        borderColor: "border-[#FE670080]",
        textColor: "text-[#FE6700]",
        label: "Pending",
      },
      approved: {
        bgColor: "bg-[#0094421A]",
        borderColor: "border-[#00944299]",
        textColor: "text-[#009442]",
        label: "Approved",
      },
      rejected: {
        bgColor: "bg-[#F931311A]",
        borderColor: "border-[#F9313180]",
        textColor: "text-[#F93131]",
        label: "Rejected",
      },
      resolved: {
        bgColor: "bg-[#6366F11A]",
        borderColor: "border-[#6366F180]",
        textColor: "text-[#6366F1]",
        label: "Resolved",
      },
    };
    return configs[status];
  };

  const getRequestsByStatus = (status: RequestData["status"]) => {
    return requests.filter((request) => request.status === status);
  };

  const getReviewsByStatus = (status: ReviewData["status"]) => {
    return reviews.filter((review) => review.status === status);
  };

  const renderRequestCard = (request: RequestData) => {
    const statusConfig = getStatusConfig(request.status);
    return (
      <div
        key={request.id}
        className="bg-[#F4F4F4] pt-[20px] px-[15px] pb-[10px] flex flex-col gap-[20px] rounded-[20px]"
      >
        <div className="flex items-center justify-between">
          <div
            className={`${statusConfig.bgColor} border py-[5px] px-[20px] rounded-[20px] ${statusConfig.borderColor} ${statusConfig.textColor} text-xs`}
          >
            {statusConfig.label}
          </div>
          <p className="text-xs text-black/60">{request.date}</p>
        </div>

        <h4 className="">{request.propertyTitle}</h4>

        <div className="flex flex-col gap-[3px]">
          <div className="flex items-center gap-[5px]">
            <UserIconSm />
            <p className="text-xs text-black/60">{request.customerName}</p>
          </div>
          <div className="flex items-center gap-[5px]">
            <MailIconSm />
            <p className="text-xs text-black/60">{request.customerEmail}</p>
          </div>
        </div>

        <div className="border-t border-black/10 pt-[10px] flex items-center justify-between gap-[10px]">
          <button
            onClick={() => handleViewRequest(request.id)}
            className="bg-[#000000] p-[10px] rounded-[20px] text-white text-xs flex-1"
          >
            View
          </button>
          {request.status !== "closed" && (
            <button
              onClick={() => handleCloseRequest(request.id)}
              className="bg-[#FAFAFA] p-[10px] rounded-[20px] text-[#F93131] text-xs flex-1"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  };

  // const renderReviewCard = (review: ReviewData) => {
  //   const statusConfig = getReviewStatusConfig(review.status);

  //   return (
  //     <div
  //       key={review.id}
  //       className="bg-[#F4F4F4] pt-[20px] px-[15px] pb-[10px] rounded-[20px] flex flex-col gap-[20px] cursor-pointer"
  //       onClick={() => openReviewModal(review)}
  //     >
  //       <div className="flex items-center justify-between">
  //         <div
  //           className={`${statusConfig.bgColor} border py-[5px] px-[15px] rounded-[20px] ${statusConfig.borderColor} ${statusConfig.textColor} text-xs`}
  //         >
  //           {statusConfig.label}
  //         </div>

  //         {review.status === 'pending' && (
  //           <div className="flex gap-1">
  //             <button
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 handleApproveReview(review.id);
  //               }}
  //               className="bg-[#0094421A] p-[8px] rounded-[15px] text-[10px] text-[#009442] hover:bg-[#00944230]"
  //             >
  //               Approve
  //             </button>
  //             <button
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 handleRejectReview(review.id);
  //               }}
  //               className="bg-[#F931311A] p-[8px] rounded-[15px] text-[10px] text-[#F93131] hover:bg-[#F9313130]"
  //             >
  //               Reject
  //             </button>
  //           </div>
  //         )}

  //         {(review.status === 'approved' || review.status === 'resolved') && (
  //           <button
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               handleMarkAsResolved(review.id);
  //             }}
  //             className="bg-[#0094421A] p-[8px] rounded-[15px] text-[10px] text-[#009442] hover:bg-[#00944230]"
  //           >
  //             {review.status === 'resolved' ? 'Resolved' : 'Mark As Resolved'}
  //           </button>
  //         )}
  //       </div>

  //       <div className="flex items-center justify-between">
  //         <div className="flex flex-col gap-[5px]">
  //           <p className="text-black/90">{review.name}</p>
  //           <StarRating rating={review.rating} />
  //         </div>
  //         <p className="text-xs text-black/60">{review.date}</p>
  //       </div>

  //       <p className="">{review.comment}</p>

  //       <div className="flex flex-col gap-[3px]">
  //         <div className="flex items-center gap-[5px]">
  //           <UserIconSm />
  //           <p className="text-xs text-black/60">{review.propertyTitle}</p>
  //         </div>

  //         <div className="flex items-center gap-[5px]">
  //           <MailIconSm />
  //           <p className="text-xs text-black/60">{review.reviewerEmail}</p>
  //         </div>
  //       </div>

  //       {review.adminReply && (
  //         <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
  //           <p className="text-xs text-blue-800 font-medium mb-1">Admin Reply:</p>
  //           <p className="text-xs text-blue-700">{review.adminReply}</p>
  //         </div>
  //       )}

  //       <div className="border-t border-black/10 pt-[10px] flex items-center justify-between gap-[10px]">
  //         <input
  //           placeholder="Type Your Reply..."
  //           type="text"
  //           className="bg-black/10 w-full p-[10px] rounded-[20px] text-sm placeholder:text-xs placeholder:text-black/70"
  //           onFocus={(e) => {
  //             e.stopPropagation();
  //             openReviewModal(review);
  //           }}
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  // Loading and error states for requests
  if (loading && activeTab === 'requests') {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error && activeTab === 'requests') {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={fetchRequests}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading and error states for reviews
  if (reviewsLoading && activeTab === 'reviews') {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (reviewsError && activeTab === 'reviews') {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {reviewsError}</p>
          <button
            onClick={fetchReviews}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Global Success Toast */}
      {toast.visible && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60]">
          <div className="bg-[#009442] text-white px-4 py-2 rounded-[10px] shadow-md text-sm">
            {toast.message}
          </div>
        </div>
      )}

      {/* Tab Container */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="bg-white rounded-[15px] p-[10px] w-full max-w-[670px]">
          <div className="flex">
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 sm:px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 flex-1 ${
                activeTab === "requests"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-50"
              }`}
            >
              Requests
            </button>
            {/* <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 sm:px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 flex-1 ${
                activeTab === "reviews"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-50"
              }`}
            >
              Reviews
            </button> */}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "requests" ? (
        <div className="flex flex-col gap-[30px]">
          <div className="flex justify-between items-center">
            <h3 className="text-xl sm:text-2xl">Request/Inquiry Management</h3>
            <button
              onClick={fetchRequests}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Refresh
            </button>
          </div>

          {/* Mobile Filter Buttons (visible on screens < lg) */}
          <div className="lg:hidden">
            <div className="bg-white rounded-[15px] p-[10px] mb-6">
              <div className="flex">
                <button
                  onClick={() => setMobileFilter("pending")}
                  className={`px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 flex-1 ${
                    mobileFilter === "pending"
                      ? "bg-[#FE6700] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Pending ({getRequestsByStatus("pending").length})
                </button>
                <button
                  onClick={() => setMobileFilter("replied")}
                  className={`px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 flex-1 ${
                    mobileFilter === "replied"
                      ? "bg-[#009442] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Confirmed ({getRequestsByStatus("replied").length})
                </button>
                <button
                  onClick={() => setMobileFilter("closed")}
                  className={`px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 flex-1 ${
                    mobileFilter === "closed"
                      ? "bg-[#F93131] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Closed ({getRequestsByStatus("closed").length})
                </button>
              </div>
            </div>

            {/* Mobile Filtered List */}
            <div className="bg-[#FAFAFA] rounded-[15px] p-[20px]">
              <div className="flex flex-col gap-[5px] mb-[20px]">
                <h4 className="text-xl sm:text-2xl capitalize">
                  {mobileFilter === "replied" ? "Confirmed" : mobileFilter} Requests
                </h4>
                <p className="text-xs text-black/50">
                  {getRequestsByStatus(mobileFilter).length} Cards
                </p>
              </div>

              {getRequestsByStatus(mobileFilter).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No {mobileFilter === "replied" ? "confirmed" : mobileFilter} requests</p>
                </div>
              ) : (
                <div className="flex flex-col gap-[20px]">
                  {getRequestsByStatus(mobileFilter).map(renderRequestCard)}
                </div>
              )}
            </div>
          </div>

          {/* Desktop 3-Column Layout (visible on screens >= lg) */}
          <div className="hidden lg:grid grid-cols-3 gap-[20px]">
            {/* Pending Column */}
            <div className="bg-[#FAFAFA] rounded-[15px] flex flex-col gap-[20px] p-[20px] h-full">
              <div className="flex flex-col gap-[5px]">
                <h4 className="text-xl sm:text-2xl">Pending</h4>
                <p className="text-xs text-black/50">
                  {getRequestsByStatus("pending").length} Cards
                </p>
              </div>
              <div className="flex flex-col gap-[20px]">
                {getRequestsByStatus("pending").map(renderRequestCard)}
              </div>
            </div>

            {/* Confirmed Column */}
            <div className="bg-[#FAFAFA] rounded-[15px] flex flex-col gap-[20px] p-[20px] h-full">
              <div className="flex flex-col gap-[5px]">
                <h4 className="text-xl sm:text-2xl">Confirmed</h4>
                <p className="text-xs text-black/50">
                  {getRequestsByStatus("replied").length} Cards
                </p>
              </div>
              <div className="flex flex-col gap-[20px]">
                {getRequestsByStatus("replied").map(renderRequestCard)}
              </div>
            </div>

            {/* Closed Column */}
            <div className="bg-[#FAFAFA] rounded-[15px] flex flex-col gap-[20px] p-[20px] h-full">
              <div className="flex flex-col gap-[5px]">
                <h4 className="text-xl sm:text-2xl">Closed</h4>
                <p className="text-xs text-black/50">
                  {getRequestsByStatus("closed").length} Cards
                </p>
              </div>
              <div className="flex flex-col gap-[20px]">
                {getRequestsByStatus("closed").map(renderRequestCard)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[30px]">
          <div className="flex justify-between items-center">
            <h3 className="text-xl sm:text-2xl">Review Management</h3>
            <button
              onClick={fetchReviews}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Refresh
            </button>
          </div>

          {/* Mobile Review Filter Buttons (visible on screens < lg) */}
          <div className="lg:hidden">
            <div className="bg-white rounded-[15px] p-[10px] mb-6">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMobileReviewFilter("pending")}
                  className={`px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    mobileReviewFilter === "pending"
                      ? "bg-[#FE6700] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Pending ({getReviewsByStatus("pending").length})
                </button>
                <button
                  onClick={() => setMobileReviewFilter("approved")}
                  className={`px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    mobileReviewFilter === "approved"
                      ? "bg-[#009442] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Approved ({getReviewsByStatus("approved").length})
                </button>
                <button
                  onClick={() => setMobileReviewFilter("rejected")}
                  className={`px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    mobileReviewFilter === "rejected"
                      ? "bg-[#F93131] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Rejected ({getReviewsByStatus("rejected").length})
                </button>
                <button
                  onClick={() => setMobileReviewFilter("resolved")}
                  className={`px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    mobileReviewFilter === "resolved"
                      ? "bg-[#6366F1] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Resolved ({getReviewsByStatus("resolved").length})
                </button>
              </div>
            </div>

            {/* Mobile Filtered Review List */}
            {/* <div className="bg-[#FAFAFA] rounded-[15px] p-[20px]">
              <div className="flex flex-col gap-[5px] mb-[20px]">
                <h4 className="text-xl sm:text-2xl capitalize">
                  {mobileReviewFilter} Reviews
                </h4>
                <p className="text-xs text-black/50">
                  {getReviewsByStatus(mobileReviewFilter).length} Cards
                </p>
              </div>

              {getReviewsByStatus(mobileReviewFilter).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No {mobileReviewFilter} reviews</p>
                </div>
              ) : (
                <div className="flex flex-col gap-[20px]">
                  {getReviewsByStatus(mobileReviewFilter).map(renderReviewCard)}
                </div>
              )}
            </div> */}
          </div>

          {/* Desktop Review Grid Layout (visible on screens >= lg) */}
          {/* <div className="hidden lg:block">
            <div className="p-[20px] flex flex-col gap-[20px] rounded-[15px] bg-[#FAFAFA]">
              <div className="flex flex-col gap-[5px]">
                <h4 className="text-xl sm:text-2xl">All Reviews</h4>
                <p className="text-xs text-black/50">
                  {reviews.length} Cards
                </p>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No reviews found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                  {reviews.map(renderReviewCard)}
                </div>
              )}
            </div>
          </div> */}
        </div>
      )}

      {/* Request Details Modal */}
      {isRequestModalOpen && selectedRequest && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          onClick={handleRequestModalBackdropClick}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[600px] bg-white rounded-[20px] overflow-hidden shadow-lg max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/10">
              <h3 className="text-lg font-semibold">Request Details</h3>
              <button
                onClick={closeRequestModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedRequest.status === 'PENDING'
                      ? 'bg-orange-100 text-orange-700'
                      : selectedRequest.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-700'
                      : selectedRequest.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedRequest.status}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Property Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Property</h4>
                <p>{selectedRequest.property
                  ? `${selectedRequest.property.address}, ${selectedRequest.property.city}`
                  : `Property ID: ${selectedRequest.propertyId}`}
                </p>
                {selectedRequest.property && (
                  <p className="text-sm text-gray-600 mt-1">
                    Price: ₦{selectedRequest.property.price.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-3">Customer Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIconSm />
                      <span className="text-sm">
                        {selectedRequest.title && `${selectedRequest.title}. `}
                        {selectedRequest.firstName} {selectedRequest.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MailIconSm />
                      <span className="text-sm">{selectedRequest.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📞 {selectedRequest.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Preferred Viewing</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {new Date(selectedRequest.preferredDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Time:</span> {selectedRequest.preferredTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedRequest.additionalInfo || selectedRequest.specialRequirements) && (
                <div className="space-y-4">
                  {selectedRequest.additionalInfo && (
                    <div>
                      <h4 className="font-medium mb-2">Additional Information</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">
                        {selectedRequest.additionalInfo}
                      </p>
                    </div>
                  )}

                  {selectedRequest.specialRequirements && (
                    <div>
                      <h4 className="font-medium mb-2">Special Requirements</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">
                        {selectedRequest.specialRequirements}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-black/10 flex gap-3">
              <button
                onClick={closeRequestModal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              {selectedRequest.status === 'CONFIRMED' && (
                <button
                  onClick={handleCompleteRequest}
                  disabled={isCompletingRequest}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompletingRequest ? 'Completing...' : 'Mark as Completed'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && selectedReview && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          onClick={handleBackdropClick}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[541px] bg-white rounded-[20px] overflow-hidden shadow-lg max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-2 border-black/10">
              <div className="w-[20px]" />
              <div className="text-center flex-1 font-semibold">Review Details</div>
              <button
                onClick={closeReviewModal}
                className="p-[6px] cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-[20px] flex flex-col gap-[20px] overflow-y-auto flex-1">
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-xs ${getReviewStatusConfig(selectedReview.status).bgColor} ${getReviewStatusConfig(selectedReview.status).textColor}`}>
                  {getReviewStatusConfig(selectedReview.status).label}
                </div>

                {selectedReview.status !== 'resolved' && (
                  <button
                    onClick={() => handleMarkAsResolved(selectedReview.id)}
                    className="bg-[#0094421A] p-[10px] rounded-[20px] text-[10px] text-[#009442] flex justify-center items-center"
                  >
                    Mark As Resolved
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[5px]">
                  <p className="text-black/90">{selectedReview.name}</p>
                  <StarRating rating={selectedReview.rating} />
                </div>
                <p className="text-xs text-black/60">{selectedReview.date}</p>
              </div>

              <p className="">{selectedReview.comment}</p>

              <div className="flex flex-col gap-[3px]">
                <div className="flex items-center gap-[5px]">
                  <UserIconSm />
                  <p className="text-xs text-black/60">
                    {selectedReview.propertyTitle}
                  </p>
                </div>

                <div className="flex items-center gap-[5px]">
                  <MailIconSm />
                  <p className="text-xs text-black/60">
                    {selectedReview.reviewerEmail}
                  </p>
                </div>
              </div>

              {selectedReview.adminReply && (
                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <p className="text-xs text-blue-800 font-medium mb-1">Current Admin Reply:</p>
                  <p className="text-xs text-blue-700">{selectedReview.adminReply}</p>
                </div>
              )}

              <div className="border-t border-black/10 pt-[10px] flex flex-col gap-[10px]">
                <div className="flex flex-col gap-[3px]">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply.id}
                      className="bg-[#00000005] p-[10px] text-left rounded-[20px] text-xs text-black/70"
                      onClick={() => handleQuickReply(reply.text)}
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
                <div className="relative w-full">
                  <input
                    ref={replyInputRef}
                    placeholder={selectedReview.adminReply ? "Update your reply..." : "Type Your Reply..."}
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleReplyKeyDown}
                    className="bg-black/10 w-full p-[10px] pr-10 rounded-[20px] text-sm placeholder:text-xs placeholder:text-black/70"
                  />
                  <button
                    aria-label="Send reply"
                    title={isSending ? "Sending..." : "Send"}
                    onClick={handleSubmitReply}
                    disabled={isSending || !replyText.trim()}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${
                      isSending || !replyText.trim()
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-black/5"
                    }`}
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRequests;
