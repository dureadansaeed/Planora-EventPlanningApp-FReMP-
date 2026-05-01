import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminComponents/AdminLayout";
import AdminDashboardContent from "../components/AdminComponents/AdminDashboardContent";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <AdminDashboardContent />
    </AdminLayout>
  );
}