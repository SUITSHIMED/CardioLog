export const getBPStatus = (sys, dia) => {
  if (!sys || !dia) return { label: "Unknown", color: "#94A3B8", description: "No data" };
  
  if (sys >= 140 || dia >= 90) 
    return { label: "Stage 2", color: "#E11D48", description: "High Hypertension" };
  if (sys >= 130 || dia >= 80) 
    return { label: "Stage 1", color: "#F97316", description: "Hypertension" };
  if (sys >= 120 && dia < 80) 
    return { label: "Elevated", color: "#F59E0B", description: "Pre-hypertension" };
    
  return { label: "Normal", color: "#10B981", description: "Healthy range" };
};