import { Request, Response, NextFunction } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/http";

export const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  res.status(err.status || INTERNAL_SERVER_ERROR).json({
    message: err.message || "Something went wrong",
    errors: err.errors,
  });
};
