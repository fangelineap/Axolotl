import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import UpdateMedicine from "@/components/Admin/Manage/Medicine/UpdateMedicine";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminMedicineById } from "../../actions";
import { AdminMedicineTable } from "../../table/data";

interface MedicinePageProps {
  params: { medicineId: string };
}

async function fetchData({ params }: MedicinePageProps) {
  const response: AdminMedicineTable = await getAdminMedicineById(
    params.medicineId
  );

  return response;
}

export async function generateMetadata({ params }: MedicinePageProps) {
  const response = await fetchData({ params });

  if (!response) {
    return {
      title: "Medicine Not Found"
    };
  }

  return {
    title: `Update Medicine ${response.name} Details`
  };
}

async function AdminUpdateMedicine({ params }: MedicinePageProps) {
  const medicine = await fetchData({ params });

  if (!medicine) {
    return (
      <AdminLayout>
        <h1 className="mb-5 text-heading-1 font-bold">No Medicine Found</h1>
        <p>No medicine details found.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="Medicine"
        pageName="Update Medicine"
      />
      <UpdateMedicine medicine={medicine} />
    </AdminLayout>
  );
}

export default AdminUpdateMedicine;
