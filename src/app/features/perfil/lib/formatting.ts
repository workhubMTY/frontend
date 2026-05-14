export function getInitials(name: string): string {
  let initials = "";
  name
    .split(" ")
    .slice(0, 2)
    .map((token) => (initials += token.at(0)));
  return initials;
}
