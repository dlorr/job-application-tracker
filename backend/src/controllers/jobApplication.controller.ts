import { Request, Response, NextFunction } from "express";
import * as service from "../services/jobApplication.service";
import { CREATED } from "../constants/http";
import { PAGINATION } from "../constants/pagination";
import { SortableField, SortOrder } from "../types/sort";
import { SORTABLE_FIELDS } from "../constants/sortableFields";
import { SORT_ORDER } from "../constants/sort";

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
  const page = Number(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const pageSize = Number(req.query.pageSize) || PAGINATION.DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * pageSize;

  const sortBy =
    (req.query.sortBy as SortableField) || SORTABLE_FIELDS.CREATED_AT;
  const sortOrder = (req.query.sortOrder as SortOrder) || SORT_ORDER.DESC;

  const filters = {
    company: req.query.company as string | undefined,
    jobPosition: req.query.jobPosition as string | undefined,
    status: req.query.status as string | undefined,
    progress: req.query.progress as string | undefined,
  };

  const jobs = await service.getAllApplications({
    offset,
    limit: pageSize,
    sortBy,
    sortOrder,
    filters,
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
