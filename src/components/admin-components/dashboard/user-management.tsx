import { useState, useEffect } from "react";
import { api, type PropertyRequest } from "../../../lib/api";

interface CustomerFromRequest {
  id: string; // Using email as unique identifier since customers can be anonymous
  name: string;
  email: string;
  phone: string;
  totalRequests: number;
  latestRequestDate: string;
  latestPropertyTitle: string;
  requestStatuses: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  requests: PropertyRequest[]; // Store all requests for this customer
}

const UserManagement = () => {
  const [customers, setCustomers] = useState<CustomerFromRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerFromRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert property requests to unique customers
  const processRequestsToCustomers = (
    requests: PropertyRequest[]
  ): CustomerFromRequest[] => {
    const customerMap = new Map<string, CustomerFromRequest>();

    requests.forEach((request) => {
      const email = request.email;
      const name = `${request.firstName} ${request.lastName}`;

      if (customerMap.has(email)) {
        // Update existing customer
        const existingCustomer = customerMap.get(email)!;
        existingCustomer.totalRequests += 1;
        existingCustomer.requests.push(request);

        // Update status counts
        switch (request.status) {
          case "PENDING":
            existingCustomer.requestStatuses.pending += 1;
            break;
          case "CONFIRMED":
            existingCustomer.requestStatuses.confirmed += 1;
            break;
          case "COMPLETED":
            existingCustomer.requestStatuses.completed += 1;
            break;
          case "CANCELLED":
            existingCustomer.requestStatuses.cancelled += 1;
            break;
        }

        // Update latest request if this one is newer
        if (
          new Date(request.createdAt) >
          new Date(existingCustomer.latestRequestDate)
        ) {
          existingCustomer.latestRequestDate = request.createdAt;
          existingCustomer.latestPropertyTitle = request.property
            ? `${request.property.address}, ${request.property.city}`
            : `Property ID: ${request.propertyId}`;
        }
      } else {
        // Create new customer entry
        const newCustomer: CustomerFromRequest = {
          id: email,
          name,
          email,
          phone: request.phoneNumber,
          totalRequests: 1,
          latestRequestDate: request.createdAt,
          latestPropertyTitle: request.property
            ? `${request.property.address}, ${request.property.city}`
            : `Property ID: ${request.propertyId}`,
          requestStatuses: {
            pending: request.status === "PENDING" ? 1 : 0,
            confirmed: request.status === "CONFIRMED" ? 1 : 0,
            completed: request.status === "COMPLETED" ? 1 : 0,
            cancelled: request.status === "CANCELLED" ? 1 : 0,
          },
          requests: [request],
        };
        customerMap.set(email, newCustomer);
      }
    });

    // Convert map to array and sort by latest request date (newest first)
    return Array.from(customerMap.values()).sort(
      (a, b) =>
        new Date(b.latestRequestDate).getTime() -
        new Date(a.latestRequestDate).getTime()
    );
  };

  // Fetch requests and convert to customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const requests = await api.admin.propertyRequests.list();
      const processedCustomers = processRequestsToCustomers(requests);
      setCustomers(processedCustomers);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch customers"
      );
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleViewCustomer = (customer: CustomerFromRequest) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={fetchCustomers}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Customers with Property Requests
          </h2>
          <button
            onClick={fetchCustomers}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {customers.length}
            </p>
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {customers.reduce((sum, c) => sum + c.requestStatuses.pending, 0)}
            </p>
            <p className="text-sm text-orange-600">Pending Requests</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {customers.reduce(
                (sum, c) => sum + c.requestStatuses.confirmed,
                0
              )}
            </p>
            <p className="text-sm text-green-600">Confirmed Requests</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {customers.reduce(
                (sum, c) => sum + c.requestStatuses.completed,
                0
              )}
            </p>
            <p className="text-sm text-blue-600">Completed Requests</p>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No customers with property requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latest Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-gray-900">
                          {customer.totalRequests} total
                        </span>
                        <div className="flex space-x-1">
                          {customer.requestStatuses.pending > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              {customer.requestStatuses.pending} pending
                            </span>
                          )}
                          {customer.requestStatuses.confirmed > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {customer.requestStatuses.confirmed} confirmed
                            </span>
                          )}
                          {customer.requestStatuses.completed > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {customer.requestStatuses.completed} completed
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(
                            customer.latestRequestDate
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {customer.latestPropertyTitle}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="text-black hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6 z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Customer Details: {selectedCustomer.name}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCustomer.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCustomer.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCustomer.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Requests
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCustomer.totalRequests}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Latest Request
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(
                        selectedCustomer.latestRequestDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Request Status Breakdown
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        {selectedCustomer.requestStatuses.pending} pending
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {selectedCustomer.requestStatuses.confirmed} confirmed
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedCustomer.requestStatuses.completed} completed
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        {selectedCustomer.requestStatuses.cancelled} cancelled
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request History */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Request History
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedCustomer.requests.map((request) => (
                    <div key={request.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {request.property
                              ? `${request.property.address}, ${request.property.city}`
                              : `Property ID: ${request.propertyId}`}
                          </p>
                          <p className="text-xs text-gray-600">
                            Requested:{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            Preferred viewing:{" "}
                            {new Date(
                              request.preferredDate
                            ).toLocaleDateString()}{" "}
                            at {request.preferredTime}
                          </p>
                          {request.additionalInfo && (
                            <p className="text-xs text-gray-600 mt-1">
                              Note: {request.additionalInfo}
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
