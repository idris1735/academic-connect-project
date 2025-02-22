export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleError(error) {
  console.error(error.stack);

  const status = error.statusCode || 500;
  const message = error.message || 'Something went wrong';

  return {
    error: {
      message,
      status
    }
  };
} 