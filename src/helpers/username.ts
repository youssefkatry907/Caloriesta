export function handleUsername(name: string) {
  return name.trim().replace(/ /g, "_").toLowerCase().slice(0, 15);
}
