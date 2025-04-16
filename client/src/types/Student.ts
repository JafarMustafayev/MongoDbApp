import type { ObjectId } from "mongodb";

// Gender tipi üçün ayrıca enum təyin edək
export type Gender = "M" | "F";

// MongoDB-dən gələn tələbə tipi
export type Student = {
  _id?: ObjectId | string; // MongoDB ObjectId və ya string (frontend uyğundur)
  firstName: string;
  lastName: string;
  gender: Gender;
  averageScore: number;
  groupNumber: string;
};
