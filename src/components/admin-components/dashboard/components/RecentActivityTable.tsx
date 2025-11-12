import type { RecentActivityTableProps } from "./props";
import DropdownButton from "../../common/DropdownButton";

const RecentActivityTable = ({
  activityFilter,
  statusFilter,
  onActivityFilterChange,
  onStatusFilterChange,
  activityTypes,
  statusTypes,
  filteredTableData,
}: RecentActivityTableProps) => (
  <div className="bg-gray-50 rounded-xl p-5 flex flex-col gap-5 shadow-sm">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>

      <div className="flex items-center gap-3 flex-wrap">
        <DropdownButton
          withBorder
          options={activityTypes}
          selected={activityFilter}
          onSelect={onActivityFilterChange}
          placeholder="Activity Type"
        />
        <DropdownButton
          withBorder
          options={statusTypes}
          selected={statusFilter}
          onSelect={onStatusFilterChange}
          placeholder="Status"
        />
      </div>
    </div>

    <div className="admin-table-container overflow-x-auto rounded-lg border border-gray-200">
      <table className="admin-table w-full bg-white">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-4 px-4 text-sm font-medium text-black/50 min-w-32">
              Activity Type
            </th>
            <th className="text-left py-4 px-4 text-sm font-medium text-black/50 min-w-40">
              Property Name
            </th>
            <th className="text-left py-4 px-4 text-sm font-medium text-black/50 min-w-48">
              Description
            </th>
            <th className="text-left py-4 px-4 text-sm font-medium text-black/50 min-w-32">
              Admin Name
            </th>
            <th className="text-left py-4 px-4 text-sm font-medium text-black/50 min-w-40">
              Timestamp
            </th>
            <th className="text-left py-4 px-4 text-sm font-medium text-black/50 min-w-24">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTableData.map((activity) => (
            <tr
              key={activity.id}
              className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <td className="py-4 px-4">
                <span className="text-sm text-black/70 font-medium">
                  {activity.activityType}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-semibold text-black/90">
                  {activity.propertyName}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-black/70">
                  {activity.description}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-black/70">
                  {activity.adminName}
                </span>
              </td>
              <td className="py-4 px-4">
                <time
                  dateTime={activity.timestamp}
                  className="text-sm text-black/50"
                >
                  {activity.timestamp}
                </time>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`
                    inline-flex
                    items-center
                    justify-center
                    px-3
                    py-2
                    rounded-[10px]
                    text-sm
                    font-medium
                    min-w-20
                    ${
                      activity.status === "Success"
                        ? "bg-[#0094421A] text-[#009442]"
                        : "bg-[#FFAB0F1A] text-[#FFAB0FF0]"
                    }
                  `}
                >
                  {activity.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {filteredTableData.length === 0 && (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No activities match your current filters.</p>
        <button
          onClick={() => {
            onActivityFilterChange("All");
            onStatusFilterChange("All");
          }}
          className="mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          Clear filters
        </button>
      </div>
    )}
  </div>
);

export default RecentActivityTable;
