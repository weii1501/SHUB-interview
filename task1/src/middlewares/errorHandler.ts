import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  // Xử lý lỗi
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode, 
    message: err.message || 'Internal Server Error',
  });
};