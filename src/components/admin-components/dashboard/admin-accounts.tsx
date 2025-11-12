import { useState } from "react";
import EditIcon from "../../../assets/edit-icon";
import CloseIcon from "../../../assets/close-icon";
import TickIcon from "../../../assets/tick-icon";

type AdminPermission =
  | "Full Access"
  | "Property-only (manage listing)"
  | "Property-only (reply to enquiries)";

type AdminStatus = "Active" | "Property-only (manage listing)" | "Pending";

interface AdminAccount {
  id: number;
  name: string;
  email: string;
  permissions: AdminPermission;
  status: AdminStatus;
  dateAdded: string;
}

const AdminAccounts = () => {
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([
    {
      id: 1,
      name: "Mary Johnson",
      email: "Maryjane@gmail.com",
      permissions: "Full Access",
      status: "Active",
      dateAdded: "01 August 2025",
    },
    {
      id: 2,
      name: "John Smith",
      email: "johnsmith@gmail.com",
      permissions: "Property-only (manage listing)",
      status: "Property-only (manage listing)",
      dateAdded: "15 July 2025",
    },
    {
      id: 3,
      name: "Sarah Wilson",
      email: "sarahwilson@gmail.com",
      permissions: "Property-only (reply to enquiries)",
      status: "Active",
      dateAdded: "22 June 2025",
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    status: "Active" as AdminStatus,
    access: "Full Access" as AdminPermission,
  });

  const handleEditClick = (admin: AdminAccount) => {
    setEditForm({
      name: admin.name,
      email: admin.email,
      status: admin.status,
      access: admin.permissions,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleRemoveAdmin = (adminId: number) => {
    setAdminAccounts((prev) => prev.filter((admin) => admin.id !== adminId));
  };

  // Status and Access options for the modal
  const statusOptions: AdminStatus[] = [
    "Active",
    "Property-only (manage listing)",
    "Pending",
  ];

  const accessOptions: AdminPermission[] = [
    "Full Access",
    "Property-only (manage listing)",
    "Property-only (reply to enquiries)",
  ];

  return (
    <div className="space-y-6">
      {/* Admin Accounts Table (single responsive table) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead className="bg-[#EAEAEA]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black/90">
                      {account.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black/90">{account.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black/90">
                    {account.permissions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black/90">
                    {account.dateAdded}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-[10px]">
                      <button
                        onClick={() => handleEditClick(account)}
                        className="p-1 bg-[#1B2BDE1A] w-[30px] h-[30px] flex items-center justify-center rounded-[10px] hover:bg-[#1B2BDE2A] transition-colors"
                        title="Edit admin"
                      >
                        <EditIcon width={16} height={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveAdmin(account.id)}
                        className="text-[#F93131] text-[14px] hover:opacity-70 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {adminAccounts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No admin accounts found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Edit Admin Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start md:items-center justify-center h-full z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[541px] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6">
              <button className="text-[#F93131] text-sm hover:opacity-70 transition-opacity">
                Remove
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Admin Details
              </h2>
              <button onClick={handleCloseModal} className="">
                <CloseIcon width={20} height={20} />
              </button>
            </div>

            {/* Active Status Badge */}
            <div className="px-6 pt-4">
              <div className="flex items-center gap-2 bg-[#0094421A] border border-[#00944280] text-[#009442] px-3 py-1 rounded-full w-[100px]">
                <span className="text-sm font-medium">Active</span>
                <TickIcon />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled
                  className="w-full px-3 py-2 bg-black/10 rounded-lg focus:outline-none"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-black/10 rounded-lg focus:outline-none"
                />
              </div>

              {/* Status Section */}
              <div>
                <label className="block text-sm font-bold text-black/60 mb-3">
                  Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((status) => (
                    <label
                      key={status}
                      className="flex items-center justify-between w-full gap-3 cursor-pointer"
                    >
                      <span className="text-sm font-bold text-black/60">
                        {status}
                      </span>

                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={editForm.status === status}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            status: e.target.value as AdminStatus,
                          }))
                        }
                        className="w-4 h-4 border-gray-300 focus:outline-none"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Access Section */}
              <div>
                <label className="block text-sm font-bold text-black/60 mb-3">
                  Access
                </label>
                <div className="space-y-2">
                  {accessOptions.map((access) => (
                    <label
                      key={access}
                      className="flex items-center justify-between w-full gap-3 cursor-pointer"
                    >
                      <span className="text-sm font-bold text-black/60">
                        {access}
                      </span>

                      <input
                        type="radio"
                        name="access"
                        value={access}
                        checked={editForm.access === access}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            access: e.target.value as AdminPermission,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccounts;
