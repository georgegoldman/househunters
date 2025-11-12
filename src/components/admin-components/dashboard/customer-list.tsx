import React, { useState } from "react";
import EyeIcon from "../../../assets/eye-icon";
import InformationIcon from "../../../assets/information-icon";
import TickIcon from "../../../assets/tick-icon";
import CloseIcon from "../../../assets/close-icon";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "banned";
  inquiries: number;
  propertiesRented: string;
  avatar: string;
}

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "Mary Johnson",
      email: "Maryjane@gmail.com",
      phone: "0903-xxx-757",
      status: "active",
      inquiries: 3,
      propertiesRented: "1 Rented (2-Bed Apt)",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      name: "John Smith",
      email: "johnsmith@gmail.com",
      phone: "0805-xxx-123",
      status: "active",
      inquiries: 5,
      propertiesRented: "2 Rented (3-Bed House, 1-Bed Studio)",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Sarah Wilson",
      email: "sarahwilson@gmail.com",
      phone: "0701-xxx-456",
      status: "banned",
      inquiries: 1,
      propertiesRented: "0",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 4,
      name: "Mike Davis",
      email: "mikedavis@gmail.com",
      phone: "0908-xxx-789",
      status: "active",
      inquiries: 2,
      propertiesRented: "1 Bought (4-Bed Villa)",
      avatar: "https://via.placeholder.com/40",
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCustomers = customers;

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: "bg-[#0094421A] border border-[#00944280] text-[#009442]",
      banned: "bg-[#F931311A] border border-[#F9313180] text-[#F93131]",
    };

    return (
      <span
        className={`px-2 py-1 flex items-center justify-center gap-[10px] text-xs font-medium rounded-full ${
          statusClasses[status as keyof typeof statusClasses]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
        {status === "active" ? <TickIcon /> : <InformationIcon />}
      </span>
    );
  };

  const handleBanToggle = (customerId: number) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              status: customer.status === "active" ? "banned" : "active",
            }
          : customer
      )
    );
  };

  const handleViewCustomer = (customerId: number) => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleBanFromModal = () => {
    if (selectedCustomer) {
      handleBanToggle(selectedCustomer.id);
      setSelectedCustomer((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "active" ? "banned" : "active",
            }
          : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EAEAEA]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email / phone No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inquiries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Properties Rented/Bought
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewCustomer(customer.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black/90">
                      {customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black/90">
                      {customer.email}
                    </div>
                    <div className="text-sm text-black/90">
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black/90">
                    {customer.inquiries}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black/90">
                    {customer.propertiesRented}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(customer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCustomer(customer.id);
                        }}
                        className="p-1 bg-[#0094421A] rounded-[10px]"
                        title="View customer"
                      >
                        <EyeIcon width={16} height={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBanToggle(customer.id);
                        }}
                        className="text-black/90 text-[14px] hover:opacity-70 transition-opacity"
                      >
                        {customer.status === "active" ? "Ban" : "Unban"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No customers found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {isModalOpen && selectedCustomer && (
        <div className="bg-opacity-50 flex items-center justify-center z-50 absolute inset-0 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBanFromModal}
                className="text-[#F93131] text-[14px] hover:opacity-70 transition-opacity"
              >
                {selectedCustomer.status === "active" ? "Ban" : "Unban"}
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                View Customer Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <CloseIcon width={20} height={20} />
              </button>
            </div>

            {/* Status */}
            <div className="mb-4 flex items-center justify-start">
              {getStatusBadge(selectedCustomer.status)}
            </div>

            {/* Customer Info and Enquiries */}
            <div className="flex justify-between mb-4">
              {/* Customer Details */}
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {selectedCustomer.name}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {selectedCustomer.email}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedCustomer.phone}
                </div>
              </div>

              {/* Enquiries */}
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Enquiries
                </div>
                <div className="text-sm text-gray-600">
                  {selectedCustomer.inquiries}
                </div>
              </div>
            </div>

            {/* Properties */}
            <div className="mb-6">
              <div className="text-sm text-gray-600">
                {selectedCustomer.propertiesRented}
              </div>
            </div>

            {/* Done Button */}
            <button
              onClick={handleCloseModal}
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
