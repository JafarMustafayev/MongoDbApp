const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/StudentsApp")
  .then(() => console.log("MongoDB bağlantısı uğurludur"))
  .catch((err) => console.error("MongoDB bağlantı xətası:", err));

// Schema
const StudentSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  groupNumber: { type: String },
  averageScore: { type: Number },
});

const StudentsCollection = mongoose.model("Students", StudentSchema);

// Pagination ilə tələbələri almaq üçün GET endpoint
app.get("/api/students", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default səhifə 1
    const limit = parseInt(req.query.limit) || 25; // Default limit 25
    const search = req.query.search || ""; // Axtarış parametri
    const skip = (page - 1) * limit;

    console.log("Səhifə:", page, "Limit:", limit, "Axtarış:", search);
    // Filter parametrləri
    let filter = {};

    // Qrup nömrəsi filtri
    if (req.query.groupNumber) {
      filter.groupNumber = req.query.groupNumber;
    }

    // Axtarış parametri
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i"); // case-insensitive regex
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { groupNumber: searchRegex },
      ];
    }

    // Ümumi sayı almaq üçün
    const total = await StudentsCollection.countDocuments(filter);

    // Səhifələnmiş tələbələri gətir
    const students = await StudentsCollection.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ lastName: 1 }); // Soyadı əlifba sırası ilə

    res.json({
      students,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Tələbələri gətirmə xətası:", error);
    res.status(500).send("Tələbələri gətirərkən server xətası baş verdi");
  }
});

// Bütün qrupları almaq üçün endpoint
app.get("/api/students/groups", async (req, res) => {
  try {
    const groups = await StudentsCollection.distinct("groupNumber");
    res.json(groups);
  } catch (error) {
    console.error("Qrupları gətirmə xətası:", error);
    res.status(500).send("Qrupları gətirərkən server xətası baş verdi");
  }
});

// Student yaratmaq üçün POST endpoint
app.post("/api/students", async (req, res) => {
  try {
    const { firstName, lastName, gender, groupNumber, averageScore } = req.body;

    // Yeni student obyektini yarat
    const newStudent = new StudentsCollection({
      firstName,
      lastName,
      gender,
      groupNumber,
      averageScore: Number(averageScore),
    });

    // Məlumat bazasına yadda saxla
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Yeni tələbə yaratma xətası:", error);
    res.status(500).send("Yeni tələbə yaradılarkən xəta baş verdi.");
  }
});

// Mövcud student-i ID ilə tapmaq və update etmek üçün PUT endpoint
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, gender, groupNumber, averageScore } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send("Keçərsiz ID formatı");
    }

    const updatedStudent = await StudentsCollection.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        gender,
        groupNumber,
        averageScore: Number(averageScore),
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) return res.status(404).send("Student tapılmadı.");
    res.json(updatedStudent);
  } catch (error) {
    console.error("Tələbə yeniləmə xətası:", error);
    res.status(400).send("Yeniləmə zamanı xəta baş verdi.");
  }
});

// Tələbəni silmək üçün DELETE endpoint
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send("Keçərsiz ID formatı");
    }

    const deletedStudent = await StudentsCollection.findByIdAndDelete(id);
    if (!deletedStudent) return res.status(404).send("Student tapılmadı.");
    res.json({ message: "Student uğurla silindi", deletedStudent });
  } catch (error) {
    console.error("Tələbə silmə xətası:", error);
    res.status(400).send("Silinmə zamanı xəta baş verdi.");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
