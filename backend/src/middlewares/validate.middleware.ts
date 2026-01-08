import { ZodObject, ZodRawShape } from "zod";

import { Request, Response, NextFunction } from "express";
import { UNPROCESSABLE_CONTENT } from "../constants/http";

export const validate =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next({
        status: UNPROCESSABLE_CONTENT,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data;
    next();
  };
