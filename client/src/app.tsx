"use client";

import { useState, useEffect } from "react";
import StudentTable from "../src/components/student-table";
import FilterDropdown from "../src/components/filter-dropdown";
import NewStudentButton from "../src/components/new-student-button";
import StudentForm from "../src/components/student-form";
import Pagination from "../src/components/pagination"; // Yeni komponent əlavə ediləcək
import axios from "axios";
import { Student } from "./types/Student";

const API_URL = "http://localhost:5000/api/students";

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Student | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);

  // Pagination state'lərini əlavə edirik
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, filter]); // filter və ya səhifə dəyişdikdə yenidən sorğu göndəririk

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      // URL parametrlərini hazırlayırıq
      let url = `${API_URL}?page=${currentPage}&limit=${pageSize}`;
      if (filter) {
        url += `&groupNumber=${filter}`;
      }

      const response = await axios.get(url);

      // Response strukturu dəyişib: {students: [...], pagination: {...}}
      setStudents(response.data.students);
      setTotalPages(response.data.pagination.pages);
      setTotalItems(response.data.pagination.total);
    } catch (err) {
      console.error("Tələbələri gətirmə xətası:", err);
      setError("Tələbələri gətirərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData: Student) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, studentData);
      console.log("Tələbə yaradıldı:", response.data);
      // Yeni tələbə əlavə edildikdən sonra ilk səhifəyə qayıdırıq
      setCurrentPage(1);
      await fetchStudents();
    } catch (err) {
      console.error("Tələbə yaratma xətası:", err);
      setError("Tələbə yaradılarkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, studentData: Student) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_URL}/${id}`, studentData);
      console.log("Tələbə yeniləndi:", response.data);
      await fetchStudents(); // Yeni məlumatları gətir
    } catch (err) {
      console.error("Tələbə yeniləmə xətası:", err);
      setError("Tələbə yenilənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log("Tələbə silindi:", response.data);
      // Son səhifədə bir nəfər varsa və silinibsə, əvvəlki səhifəyə keçirik
      if (students.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchStudents();
      }
    } catch (err) {
      console.error("Tələbə silmə xətası:", err);
      setError("Tələbə silinərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (studentData: Student) => {
    if (studentToEdit?._id) {
      updateStudent(studentToEdit._id.toString(), studentData);
    } else {
      createStudent(studentData);
    }
    setShowForm(false);
    setStudentToEdit(undefined);
  };

  const handleDelete = (student: Student) => {
    if (
      window.confirm(
        `Tələbə ${student.firstName} ${student.lastName} silinsin?`
      )
    ) {
      if (student._id) {
        console.log("Silinəcək tələbənin ID-si:", student._id);
        deleteStudent(student._id.toString());
      } else {
        setError("Silinəcək tələbənin ID-si yoxdur");
      }
    }
  };

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setShowForm(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Bütün qrupları gətirmək üçün ayrı API istəyi
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // groupOptions state'ini burada update edə bilərsiniz
      } catch (err) {
        console.error("Qrupları gətirmə xətası:", err);
      }
    };

    fetchGroups();
  }, []);

  // Qrupları cəkmək üçün əlavə API endpoint yaratmaq lazımdır
  // və ya bu məntiqə görə frontend-də işləmək olar
  const groupOptions = Array.from(new Set(students.map((s) => s.groupNumber)));

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-6">
          <NewStudentButton
            onClick={() => {
              setShowForm(true);
              setStudentToEdit(undefined);
            }}
          />

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <div className="text-sm text-gray-500 mt-2 text-center">
              Ümumi {totalItems} tələbədən {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalItems)} arası göstərilir
            </div>
          </div>
          <FilterDropdown
            options={groupOptions}
            onSelect={(value) => {
              setFilter(value);
              setCurrentPage(1); // Filtrlədikdə ilk səhifəyə qayıdırıq
            }}
            selectedOption={filter}
          />
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        {showForm && (
          <div className="mb-6">
            <StudentForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setStudentToEdit(undefined);
              }}
              studentToEdit={studentToEdit}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <StudentTable
              students={students}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentPage={currentPage}
              pageSize={pageSize}
            />

            {/* Pagination komponenti */}
          </>
        )}
      </div>
    </main>
  );
}
