// app/features/cubiculos/constants/floors.ts

export type FloorOption = {
  code: string;
  label: string;
  mapSrc: string;
};

export const OFFICE_FLOORS: FloorOption[] = [
  {
    code: "PZ",
    label: "PZ",
    mapSrc: "/maps/planta-baja.svg",
  },
  {
    code: "P3",
    label: "Piso 3",
    mapSrc: "/maps/piso-3.svg",
  },
];