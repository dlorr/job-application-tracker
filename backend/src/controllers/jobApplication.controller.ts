import { Request, Response, NextFunction } from "express";
import * as service from "../services/jobApplication.service";
import { CREATED } from "../constants/http";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await service.createApplication(req.body);
    res.status(CREATED).json(job);
  } catch (e) {
    next(e);
  }
};

export const findAll = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const sortBy = (req.query.sortBy as string) || "createdAt";
  const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

  const jobs = await service.getAllApplications({
    offset,
    limit: pageSize,
    sortBy,
    sortOrder,
  });
  res.json(jobs);
};

export const findOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await service.getApplicationById(req.params.id);
    res.json(job);
  } catch (e) {
    next(e);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await service.updateApplication(req.params.id, req.body);
    res.json(job);
  } catch (e) {
    next(e);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await service.deleteApplication(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
