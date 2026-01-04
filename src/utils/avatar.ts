export const stringToColor = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 65%)`;
};

export const getInitial = (value?: string) => {
  if (!value) return "?";
  const initial = value.trim().charAt(0);
  return initial ? initial.toUpperCase() : "?";
};
