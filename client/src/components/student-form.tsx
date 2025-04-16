"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { Student } from "../types/Student";
import { X } from "lucide-react";

interface StudentFormProps {
  onSubmit: (student: Student) => void;
  onCancel: () => void;
  studentToEdit?: Student;
}

export default function StudentForm({
  onSubmit,
  onCancel,
  studentToEdit,
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "M" as "M" | "F",
    averageScore: "",
    groupNumber: "",
  });

  // StudentToEdit dəyişdiyində formanı yenilə
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        firstName: studentToEdit.firstName || "",
        lastName: studentToEdit.lastName || "",
        gender: studentToEdit.gender || "M",
        averageScore: studentToEdit.averageScore.toString() || "",
        groupNumber: studentToEdit.groupNumber || "",
      });
    } else {
      // Formanı təmizlə
      setFormData({
        firstName: "",
        lastName: "",
        gender: "M" as "M" | "F",
        averageScore: "",
        groupNumber: "",
      });
    }
  }, [studentToEdit]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Xətanı təmizlə
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Ad daxil edilməlidir";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Soyad daxil edilməlidir";
    }

    if (!formData.groupNumber.trim()) {
      newErrors.groupNumber = "Qrup nömrəsi daxil edilməlidir";
    }

    const score = Number.parseFloat(formData.averageScore);
    if (isNaN(score) || score < 0 || score > 100) {
      newErrors.averageScore = "Bal 0-100 arasında olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit({
        _id: studentToEdit?._id || undefined,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender as "M" | "F",
        averageScore: Number.parseFloat(formData.averageScore),
        groupNumber: formData.groupNumber,
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          {studentToEdit
            ? "Tələbə məlumatlarını düzəlt"
            : "Yeni tələbə əlavə et"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ad
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Soyad
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cins
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="M">Kişi</option>
              <option value="F">Qadın</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="averageScore"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bal ortalaması
            </label>
            <input
              type="number"
              id="averageScore"
              name="averageScore"
              value={formData.averageScore}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.averageScore ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.averageScore && (
              <p className="mt-1 text-sm text-red-600">{errors.averageScore}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="groupNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Qrup nömrəsi
            </label>
            <input
              type="text"
              id="groupNumber"
              name="groupNumber"
              value={formData.groupNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.groupNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.groupNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.groupNumber}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Ləğv et
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {studentToEdit ? "Yadda saxla" : "Əlavə et"}
          </button>
        </div>
      </form>
    </div>
  );
}
