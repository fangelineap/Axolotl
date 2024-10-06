import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import UpdateMedicine from "@/components/Admin/Manage/Medicine/UpdateMedicine";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminMedicineById } from "../../actions";
import { AdminMedicineTable } from "../../table/data";

interface MedicinePageProps {
  params: { medicineId: string };
}

/**
 * * Fetch Data for Admin Edit Medicine Page
 * @param param0
 * @returns
 */
async function fetchData({ params }: MedicinePageProps) {
  const response: AdminMedicineTable = await getAdminMedicineById(
    params.medicineId
  );

  return response;
}

/**
 * * Generate Metadata for Admin Edit Medicine Page
 * @param param0
 * @returns
 */
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

/**
 * * Render Admin Edit Medicine Page
 * @param param0
 * @returns
 */
async function AdminUpdateMedicine({ params }: MedicinePageProps) {
  const medicine = await fetchData({ params });

  if (!medicine) {
    return (
      <AdminLayout>
        <div className="mx-20 flex h-[75vh] w-auto items-center justify-center">
          <h1 className="mb-5 text-heading-1 font-bold">
            Something went wrong
          </h1>
        </div>
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
