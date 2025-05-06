
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const useForumFormatters = () => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatExactDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  const getInitials = (name: string = 'Utilisateur') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return {
    formatDate,
    formatExactDate,
    getInitials
  };
};
