import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const [course, setCourse] = useState("");

  const updatePassword = async () => {
    try {
      await API.put("/update-password", passwordData);
      alert("Password Updated");
    } catch {
      alert("Error updating password");
    }
  };

  const updateCourse = async () => {
    try {
      await API.put("/update-course", { course });
      alert("Course Updated");
    } catch {
      alert("Error updating course");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container dashboard">
      <h2>Dashboard</h2>

      <div className="card">
        <h3>Welcome {user?.name}</h3>
        <p>Email: {user?.email}</p>
        <p>Course: {user?.course}</p>
      </div>

      <div className="section">
        <h3>Update Password</h3>
        <input placeholder="Old Password"
          onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} />

        <input placeholder="New Password"
          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />

        <button onClick={updatePassword}>Update Password</button>
      </div>

      <div className="section">
        <h3>Change Course</h3>
        <input placeholder="New Course"
          onChange={(e) => setCourse(e.target.value)} />

        <button onClick={updateCourse}>Update Course</button>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;