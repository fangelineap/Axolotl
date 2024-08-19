import { getAdminMedicine } from "../actions";

export interface AdminMedicineTable {
  uuid: string;
  name: string;
  type: string;
  exp_date: Date;
  price: number;
  medicine_photo?: string;
}

export const data = async (): Promise<AdminMedicineTable[]> => {
  const { data, error } = await getAdminMedicine();

  if (error) {
    console.error("Unhandled error:", error);
    return [];
  }

  return data.map((item) => ({
    uuid: item.uuid,
    name: item.name,
    type: item.type,
    exp_date: new Date(item.exp_date),
    price: item.price,
    medicine_photo: item.medicine_photo,
  }));
};
