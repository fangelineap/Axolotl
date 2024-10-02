import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import AddMedicine from "@/components/Admin/Manage/Medicine/AddMedicine";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Add Medicine");

function AdminAddMedicine() {
  return (
    <AdminLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="Medicine"
        pageName="Add Medicine"
      />
      <AddMedicine />
    </AdminLayout>
  );
}

export default AdminAddMedicine;
