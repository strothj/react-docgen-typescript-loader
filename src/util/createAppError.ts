interface AppError extends Error {
  innerError?: Error;
}

/**
 * Creates an error message using the provided error object or error message. It
 * wraps the message with the name of the plugin to make it easier to track down
 * issues when debugging build errors.
 *
 * @param error Error message or error object to wrap.
 */
function createAppError(error?: Error | string): Error {
  const errorMessage = error
    ? typeof error === "string" ? error : error.message
    : "An unexpected error has occurred.";

  const appError: AppError = new Error(
    `react-docgen-typescript-webpack-plugin: ${errorMessage}`,
  );

  appError.innerError = typeof error === "string" ? undefined : error;

  Error.captureStackTrace(appError, createAppError);

  return appError;
}

export default createAppError;
