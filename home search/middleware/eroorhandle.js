const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statuscode || 500;
  const message = err.message || 'Internal Server Error';
  const error = err.error || [];

  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export default globalErrorHandler;
