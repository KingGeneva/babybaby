
export function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  
  const yearDiff = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  const dayDiff = now.getDate() - birth.getDate();
  
  let years = yearDiff;
  let months = monthDiff;
  
  // Adjust if the current date is before the birth day in the current month
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years--;
    months = 12 + monthDiff;
  }
  
  // For children under 2 years, show age in months
  if (years < 2) {
    const totalMonths = years * 12 + months;
    return `${totalMonths} mois`;
  }
  
  // For children 2 years and older
  return `${years} an${years > 1 ? 's' : ''}`;
}
