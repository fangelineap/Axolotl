import AddMedicine from "@/components/Admin/Manage/Medicine/AddMedicine";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Add Medicine");

function AdminAddMedicine() {
  return (
    <DefaultLayout>
      <div className="mx-4 h-auto w-auto md:mx-20">
        <AdminBreadcrumbs
          parentPage="Manage"
          subPage="Medicine"
          pageName="Add Medicine"
        />
        <AddMedicine />
      </div>
    </DefaultLayout>
  );
}

export default AdminAddMedicine;
