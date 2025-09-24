export function buildParams(params: Record<string, string | number | boolean | undefined>): string {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlParams.append(key, value.toString());
    }
  });

  return urlParams.toString();
}

function camelToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function formatParamsToSnakeCase(params: Record<string, string | number | boolean | undefined>): Record<string, string | number | boolean | undefined> {
  const formattedParams: Record<string, string | number | boolean | undefined> = {};

  Object.entries(params).forEach(([key, value]) => {
    const snakeKey = camelToSnakeCase(key);
    formattedParams[snakeKey] = value;
  });

  return formattedParams;
}

export function buildSnakeCaseParams(params: Record<string, string | number | boolean | undefined>): string {
  const snakeCaseParams = formatParamsToSnakeCase(params);
  const urlParams = new URLSearchParams();

  Object.entries(snakeCaseParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlParams.append(key, value.toString());
    }
  });

  return urlParams.toString();
}

export function parseDateToYYYYMMDD(date: Date | null): string {
  if (!date) { return '' }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}


