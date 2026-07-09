/**
 * Utility to sanitize user input and prevent XSS or injection vectors
 */
export const sanitizeString = (val: any): string => {
  if (typeof val !== "string") return "";
  // Strip HTML tags using regex to prevent stored XSS
  return val.replace(/<[^>]*>/g, "").trim();
};

export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = { ...obj } as any;
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeString(sanitized[key]);
    } else if (Array.isArray(sanitized[key])) {
      sanitized[key] = sanitized[key].map((item: any) => 
        typeof item === "object" && item !== null 
          ? sanitizeObject(item) 
          : typeof item === "string" 
            ? sanitizeString(item) 
            : item
      );
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  return sanitized;
};
