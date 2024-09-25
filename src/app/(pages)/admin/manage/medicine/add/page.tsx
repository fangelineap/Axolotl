import AddMedicine from "@/components/Admin/Manage/Medicine/AddMedicine";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Add Medicine");

function AdminAddMedicine() {
  return (
    <DefaultLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="Medicine"
        pageName="Add Medicine"
      />
      <div className="mx-20 h-auto w-auto">
        <AddMedicine />
      </div>
    </DefaultLayout>
  );
}

export default AdminAddMedicine;
