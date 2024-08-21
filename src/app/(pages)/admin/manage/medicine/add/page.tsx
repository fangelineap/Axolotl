import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

function AdminAddMedicine() {
  return (
    <DefaultLayout>
      <AdminBreadcrumbs parentPage="Manage" pageName="Medicine" />
      <div className="mx-20 w-auto">
        <h1 className="mb-5 text-heading-1 font-bold">Medicine List</h1>
        
      </div>
    </DefaultLayout>
  );
}

export default AdminAddMedicine;
