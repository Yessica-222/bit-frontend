export interface Service {
  _id?: string;        // viene de MongoDB, puede ser opcional
  name: string;
  description: string | null;
  price: number;
  duration: number;    // en minutos
  createdAt?: string;  // opcional, lo devuelve el backend
  updatedAt?: string;  // opcional, lo devuelve el backend
}
