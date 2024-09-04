import AddMedicine from "@/components/Admin/Manage/Medicine/AddMedicine";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Add User");

function AdminAddMedicine() {
  return (
    <DefaultLayout>
      <AdminBreadcrumbs parentPage="Manage" subPage="User" pageName="Profile" />
      <AddMedicine />
    </DefaultLayout>
  );
}

export default AdminAddMedicine;
