export type AdminMedicineTable = {
  uuid?: string;
  name: string;
  type: string;
  exp_date: string | Date;
  price: number;
  medicine_photo?: string;
}
