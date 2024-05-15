export const getInitials = (name: string | null | undefined): string => {

  if (name == null) {
    return '';
  }

  const nameToParse = String(name);

  const words = nameToParse.trim().split(/\s+/);

  if (words.length === 0) {
    return '';
  }

  if (words.length > 1) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  return words[0].charAt(0).toUpperCase();
};