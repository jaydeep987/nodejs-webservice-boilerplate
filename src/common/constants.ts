/**
 * Various response status codes
 */
export enum ResponseStatus {
  OK = 200,
  OK_CREATED = 201,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  BAD_REQUEST = 400,
  AUTH_FAILED = 401,
}

/**
 * Various error types to be used when giving response
 */
export const ErrorTypes = {
  INTERNAL_ERROR: 'Internal Error',
  VALIDATION_ERROR: 'Validation Error',
  FETCH_ERROR: 'Retrieve Error',
  PARAM_ERROR: 'Parameter Error',
};
