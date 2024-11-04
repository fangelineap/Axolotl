import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import ViewMedicine from "@/components/Admin/Manage/Medicine/ViewMedicine";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import { getAdminMedicineById } from "../actions";
import { AdminMedicineTable } from "../table/data";

interface MedicinePageProps {
  params: { medicineId: string };
}

/**
 * * Fetch Data for Admin Detailed Medicine Page
 * @param params
 * @returns
 */
async function fetchData({ params }: MedicinePageProps) {
  const response: AdminMedicineTable = await getAdminMedicineById(
    params.medicineId
  );

  return response;
}

/**
 * * Generate Metadata for Admin Detailed Medicine Page
 * @param params
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
    title: `${response.name} Details`
  };
}

/**
 * * Render Admin Detailed Medicine Page
 * @param params
 * @returns
 */
async function AdminShowMedicine({ params }: MedicinePageProps) {
  const medicine = await fetchData({ params });

  if (!medicine) {
    return (
      <CustomLayout>
        <div className="mx-20 flex h-[75vh] w-auto items-center justify-center">
          <h1 className="mb-5 text-heading-1 font-bold">
            Something went wrong
          </h1>
        </div>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout>
      <CustomBreadcrumbs
        parentPage="Manage"
        subPage="Medicine"
        pageName="View"
      />
      <ViewMedicine medicine={medicine} />
    </CustomLayout>
  );
}

export default AdminShowMedicine;
