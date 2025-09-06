export interface Appointment {
  _id?: string;
  userId: string;
  serviceId: string;
  appointmentDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
