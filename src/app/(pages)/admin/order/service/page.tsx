import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Axolotl - Admin Order Service Logs"
};

function AdminOrderService() {
  return (
    <AdminLayout>
      <div>AdminOrderService</div>
    </AdminLayout>
  );
}

export default AdminOrderService;
