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
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 10;

  const jobs = await service.getAllApplications(offset, limit);
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
