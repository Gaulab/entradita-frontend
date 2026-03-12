// utils/apiUtils.js

export class ApiClientError extends Error {
  constructor({ message, status, code, details, data }) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.data = data;
    this.response = {
      status,
      data,
    };
  }
}

const getFirstMessage = (value) => {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const item = value[index];

      if (typeof item === 'string') {
        return item;
      }

      if (item && typeof item === 'object') {
        const nestedMessage = getFirstMessage(item);
        if (nestedMessage) {
          return `Error en el item #${index + 1}: ${nestedMessage}`;
        }
      }
    }
    return null;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    for (const [key, nestedValue] of entries) {
      const nestedMessage = getFirstMessage(nestedValue);
      if (nestedMessage) {
        return Array.isArray(nestedValue) ? `${key}: ${nestedMessage}` : nestedMessage;
      }
    }
    return null;
  }

  if (value == null) {
    return null;
  }

  return String(value);
};

const normalizeApiError = (errorData, defaultMessage, status) => {
  if (errorData?.error && typeof errorData.error === 'object') {
    return {
      message: errorData.error.message || defaultMessage,
      code: errorData.error.code || 'api_error',
      details: errorData.error.details || null,
      data: errorData,
      status,
    };
  }

  if (typeof errorData?.error === 'string') {
    return {
      message: errorData.error,
      code: 'api_error',
      details: errorData.details || null,
      data: errorData,
      status,
    };
  }

  if (typeof errorData?.detail === 'string') {
    return {
      message: errorData.detail,
      code: 'api_error',
      details: null,
      data: errorData,
      status,
    };
  }

  const derivedMessage = getFirstMessage(errorData);

  return {
    message: derivedMessage || defaultMessage,
    code: 'validation_error',
    details: errorData && typeof errorData === 'object' ? errorData : null,
    data: errorData,
    status,
  };
};

const parseResponseBody = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text ? { detail: text } : null;
};

export const handleApiError = async (response, defaultMessage = 'Ocurrió un error inesperado') => {
  if (response.ok) {
    return null;
  }

  let errorData = null;

  try {
    errorData = await parseResponseBody(response);
  } catch {
    throw new ApiClientError({
      message: defaultMessage,
      status: response.status,
      code: 'response_parse_error',
      details: null,
      data: null,
    });
  }

  const normalized = normalizeApiError(errorData, defaultMessage, response.status);

  throw new ApiClientError(normalized);
};

export const apiRequest = async (url, options = {}, defaultMessage = 'Ocurrió un error inesperado') => {
  const response = await fetch(url, options);

  await handleApiError(response, defaultMessage);

  return parseResponseBody(response);
};