
export function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  
  const yearDiff = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  let years = yearDiff;
  let months = monthDiff;
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    years--;
    months = 12 + monthDiff;
  }
  
  if (years < 2) {
    const totalMonths = years * 12 + months;
    return `${totalMonths} mois`;
  }
  
  return `${years} an${years > 1 ? 's' : ''}`;
}
