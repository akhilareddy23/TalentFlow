export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return "Email address is required.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} is required.`;
  }
  return null;
};

export const validateUrl = (url, fieldName) => {
  if (!url || url.trim() === "") {
    return `${fieldName} is required.`;
  }
  // Standard URL regex
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
  if (!urlRegex.test(url)) {
    return `Please enter a valid URL (starting with http:// or https://) for ${fieldName}.`;
  }
  return null;
};

export const validateNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return `${fieldName} is required.`;
  }
  if (isNaN(Number(value)) || Number(value) < 0) {
    return `${fieldName} must be a positive number.`;
  }
  return null;
};
