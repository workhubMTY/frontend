export function DrawerErrorState() {
  return (
    <div className="px-8 py-6">
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
        <h3 className="text-sm font-semibold text-red-900">
          No se pudieron cargar los logros de esta amistad
        </h3>

        <p className="mt-1 text-sm text-red-700">
          Intenta seleccionar otra amistad o vuelve a intentarlo más tarde.
        </p>
      </div>
    </div>
  );
}