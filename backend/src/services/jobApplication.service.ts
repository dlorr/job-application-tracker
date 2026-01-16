import { prisma } from "../prisma";
import { ApiError } from "../errors/apiError";
import { NOT_FOUND } from "../constants/http";
import { GetAllParams } from "../types/getAllApplications";
import { SORTABLE_FIELDS } from "../constants/sortableFields";
import { CreateJobApplicationDTO } from "../dtos/createJobApplication.dto";
import { UpdateJobApplicationDTO } from "../dtos/updateJobApplication.dto";
import { Prisma } from "../../generated/prisma/client";

export const createApplication = (data: CreateJobApplicationDTO) => {
  return prisma.jobApplication.create({
    data,
  });
};

export const getAllApplications = async ({
  offset,
  limit,
  sortBy,
  sortOrder,
  filters,
}: GetAllParams) => {
  const allowedSortFields = Object.values(SORTABLE_FIELDS);

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : SORTABLE_FIELDS.CREATED_AT;

  const where: Prisma.JobApplicationWhereInput = {
    ...(filters.company && {
      company: {
        contains: filters.company,
        mode: "insensitive",
      },
    }),
    ...(filters.jobPosition && {
      jobPosition: {
        contains: filters.jobPosition,
        mode: "insensitive",
      },
    }),
    ...(filters.status && { status: filters.status as any }),
    ...(filters.progress && { progress: filters.progress as any }),
  };

  const [data, total] = await Promise.all([
    prisma.jobApplication.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: {
        [safeSortBy]: sortOrder,
      },
    }),
    prisma.jobApplication.count({ where }),
  ]);

  return {
    data,
    total,
  };
};

export const getApplicationById = async (id: string) => {
  const job = await prisma.jobApplication.findUnique({
    where: { id },
  });

  if (!job) {
    throw new ApiError(NOT_FOUND, "Job application not found");
  }

  return job;
};

export const updateApplication = async (
  id: string,
  data: UpdateJobApplicationDTO
) => {
  await getApplicationById(id);

  return prisma.jobApplication.update({
    where: { id },
    data,
  });
};

export const deleteApplication = async (id: string) => {
  await getApplicationById(id);

  await prisma.jobApplication.delete({
    where: { id },
  });
};
