import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { AdminApprovalTable } from "../table/data";
import { getAdminApprovalById, getAdminCaregiverDataById } from "../actions";

interface ApprovalPageProps {
  params: { userId: string };
}

async function fetchData({ params }: ApprovalPageProps) {
  const response = await getAdminCaregiverDataById(Number(params.userId));
  return response as AdminApprovalTable;
}

async function fetchCaregiverDetails(caregiver_id: string) {
  const response = await getAdminApprovalById(caregiver_id);
  return response as AdminApprovalTable;
}

export async function generateMetadata({ params }: ApprovalPageProps) {
  const caregiver = await fetchData({ params });
  const response = await fetchCaregiverDetails(caregiver.caregiver_id);

  if (!response) {
    return {
      title: "User Not Found",
    };
  }

  const full_name = response.user.first_name + " " + response.user.last_name;

  return {
    title: `${full_name} Details`,
  };
}

async function AdminShowMedicine({ params }: ApprovalPageProps) {
  const caregiver = await fetchData({ params });

  if (!caregiver) {
    return (
      <DefaultLayout>
        <div className="mx-20 h-[75vh] w-auto flex items-center justify-center">
          <h1 className="mb-5 text-heading-1 font-bold">Something went wrong</h1>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="Approval"
        pageName="Profile"
      />
    </DefaultLayout>
  );
}

export default AdminShowMedicine;
