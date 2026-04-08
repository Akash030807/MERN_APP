const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, course } = req.body;

  try {
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      email,
      password: hashed,
      course
    });

    await student.save();
    res.json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Student.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
      res.json({ token, user });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  exports.updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    try {
      const user = await Student.findById(req.user.id);
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Wrong old password" });
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.json({ msg: "Password updated" });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  exports.updateCourse = async (req, res) => {
    const { course } = req.body;
  
    try {
      const user = await Student.findById(req.user.id);
      user.course = course;
      await user.save();
  
      res.json({ msg: "Course updated" });
    } catch (err) {
      res.status(500).json(err);
    }
  };