"use client";

import { useState } from "react";
import type { Student } from "../types/Student";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

type SortField = keyof Student;
type SortDirection = "asc" | "desc";

export default function StudentTable({
  students,
  onEdit,
  onDelete,
  currentPage = 1,
  pageSize = 25,
}: {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  currentPage?: number;
  pageSize?: number;
}) {
  const [sortField, setSortField] = useState<SortField>("lastName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // null və undefined dəyərlər üçün yoxlama
    if (aValue === null || aValue === undefined)
      return sortDirection === "asc" ? -1 : 1;
    if (bValue === null || bValue === undefined)
      return sortDirection === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }
  });

  // Sıra nömrəsini hesablamaq üçün baza indeks (səhifələməyə görə)
  const baseIndex = (currentPage - 1) * pageSize;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Sıra nömrəsi üçün yeni başlıq */}
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              №
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("firstName")}
            >
              <div className="flex items-center">
                Ad
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("lastName")}
            >
              <div className="flex items-center">
                Soyad
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("gender")}
            >
              <div className="flex items-center">
                Cins
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("averageScore")}
            >
              <div className="flex items-center">
                Bal ortalaması
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("groupNumber")}
            >
              <div className="flex items-center">
                Qrup nömrəsi
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Əməliyyatlar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedStudents.length > 0 ? (
            sortedStudents.map((student, index) => (
              <tr
                key={
                  student._id?.toString() ||
                  `${student.firstName}-${student.lastName}-${student.groupNumber}`
                }
              >
                {/* Sıra nömrəsi xanası */}
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-500 text-center">
                  {baseIndex + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.firstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.gender == "M" ? "Kişi" : "Qadın"}

                  {}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.averageScore.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.groupNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                  <button
                    onClick={() => onEdit(student)}
                    className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Düzəliş</span>
                  </button>
                  <button
                    onClick={() => onDelete(student)}
                    className="flex items-center space-x-1 bg-white border border-red-300 rounded-md px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Sil</span>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7} // Sütun sayını 6-dan 7-yə artırdıq çünki sıra nömrəsi əlavə etdik
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Heç bir tələbə tapılmadı
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
