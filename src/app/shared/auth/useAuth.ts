import { useContext } from "react";
import { AuthContext } from "./auth.context";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth solo debe ser utilizada en un componente dentro del proveedor",
    );
  }

  return context;
}
