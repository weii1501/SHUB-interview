import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../core/error.response";

export const validationErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req).array();
  const messages = errors.map((error) => error.msg);
  if (errors.length > 0) {
    throw new BadRequestError(messages.join(", "));
  }
  next();
};
