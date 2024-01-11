export function getInitials(name: string) {
  if(name.length > 0) {
    const words = name.split(' ');

    if (words.length === 1) {
      // If there's only one word in the name, return the first character of that word
      return words[0][0].toUpperCase();
    } else {
      // If there are multiple words, concatenate the first character of each word
      return words.map(word => word[0].toUpperCase()).join('');
    }
  } else {
    return "N"
  }
};

export function getTimeAgo(timestamp: string) {
  const currentDate = new Date();
  const date = new Date(timestamp);

  const timeDifference = currentDate.getTime() - date.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // Approximation, may vary
  const years = Math.floor(days / 365); // Approximation, may vary

  if (isNaN(date.getTime())) {
    // Handle invalid timestamp
    return 'Invalid timestamp';
  }

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}