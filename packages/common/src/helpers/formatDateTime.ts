export function formatDateTime(dateString : any) {
    const date = new Date(dateString);
    
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
  
    return date.toLocaleDateString('en-GB', options); // e.g., "3 April 2025"
  }
  