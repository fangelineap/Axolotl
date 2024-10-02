import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Axolotl - Admin Order Medicine Logs"
};

function AdminOrderMedicine() {
  return (
    <AdminLayout>
      <div>AdminOrderMedicine</div>
    </AdminLayout>
  );
}

export default AdminOrderMedicine;
