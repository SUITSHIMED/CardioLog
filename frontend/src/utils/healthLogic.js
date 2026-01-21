export const getBPStatus = (sys, dia) => {
  if (sys >= 140 || dia >= 90) return { label: "Stage 2", color: "#E11D48" };
  if (sys >= 130 || dia >= 80) return { label: "Stage 1", color: "#F97316" };
  if (sys >= 120 && dia < 80) return { label: "Elevated", color: "#F59E0B" };
  return { label: "Normal", color: "#10B981" };
};