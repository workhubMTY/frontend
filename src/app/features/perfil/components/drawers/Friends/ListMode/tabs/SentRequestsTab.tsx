import { Clock, Loader2, X } from "lucide-react";

import { Avatar } from "../../../../utils/Avatar";
import type { SentFriendRequest } from "../../types";
import { EmptyState } from "../EmptyState";
import { CancelButton } from "../../utils/CancelButton";

type SentRequestsTabProps = {
  requests: SentFriendRequest[];
  isLoading?: boolean;
  isError?: boolean;
  cancellingRequestId?: string | null;
  isCancellingRequest?: boolean;
  onCancelRequest: (requestId: string) => void | Promise<void>;
};

export function SentRequestsTab({
  requests,
  isLoading = false,
  isError = false,
  cancellingRequestId,
  isCancellingRequest = false,
  onCancelRequest,
}: SentRequestsTabProps) {
  if (isLoading) {
    return (
      <EmptyState
        title="Cargando solicitudes"
        description="Estamos buscando las solicitudes de amistad que enviaste."
      />
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="No se pudieron cargar las solicitudes"
        description="Intenta cerrar y abrir el panel nuevamente."
      />
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No hay solicitudes enviadas"
        description="Cuando invites a alguien, aparecerá aquí mientras espera respuesta."
      />
    );
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {requests.map((request) => {
        const isCancelling =
          isCancellingRequest && cancellingRequestId === request.eId;

        return (
          <article
            key={request.id}
            className="grid items-center gap-4 border-l-4 border-transparent px-7 py-4 transition hover:bg-neutral-50 md:grid-cols-[1fr_auto]"
          >
            <div className="flex min-w-0 items-center gap-4">
              <Avatar name={request.name} avatarUrl={request.avatarUrl} />

              <div className="min-w-0">
                <h3 className="truncate text-md font-semibold text-neutral-950">
                  {request.name}
                </h3>

                <h4 className="truncate text-sm font-light text-neutral-500">
                  {request.email}
                </h4>

                {request.createdAt && (
                  <p className="text-xs text-neutral-400">
                    Enviada el {request.createdAt}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <span className="inline-flex h-9 w-fit items-center gap-2 border border-amber-200 bg-amber-50 px-3 text-sm font-medium text-amber-700">
                <Clock size={16} />
                Pendiente
              </span>

              <CancelButton
                onAction={(id) => onCancelRequest(id)}
                itemId={request.eId}
                isLoading={isCancelling}
              />
            </div>
          </article>
        );
      })}
    </ul>
  );
}
