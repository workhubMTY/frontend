export function normalizeCapacityInput(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      isValid: true,
      value: "",
    };
  }

  const numberValue = Number(trimmedValue);

  if (!Number.isInteger(numberValue) || numberValue < 1) {
    return {
      isValid: false,
      value: trimmedValue,
    };
  }

  return {
    isValid: true,
    value: String(numberValue),
  };
}
