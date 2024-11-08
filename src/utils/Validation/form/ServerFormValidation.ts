/**
 * * Validate required fields
 * @param fields
 * @returns
 */
export function ServerFormValidation(fields: Record<string, any>) {
  for (const [key, value] of Object.entries(fields)) {
    if (value === null || value === undefined) {
      return {
        name: `Missing ${key}`,
        message: `${key} is required`
      };
    }
  }

  return null;
}
