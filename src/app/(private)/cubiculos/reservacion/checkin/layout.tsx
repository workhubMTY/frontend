// Office-checkin lives inside (private) so it inherits AuthProvider + AuthGuard
// from the parent layout. No special role guard needed — any authenticated user
// can reach their own office check-in.
// We return children directly; the parent layout already wraps everything.
export default function OfficeCheckinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
