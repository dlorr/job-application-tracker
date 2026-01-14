import { prisma } from "../prisma";
import { ApiError } from "../errors/apiError";
import { NOT_FOUND } from "../constants/http";
import { GetAllParams, SortableFields } from "../types/getAllTypes";

export const createApplication = (data: any) => {
  return prisma.jobApplication.create({
    data,
  });
};

export const getAllApplications = async ({
  offset,
  limit,
  sortBy,
  sortOrder,
}: GetAllParams) => {
  const allowedSortFields: SortableFields[] = [
    "createdAt",
    "dateApplied",
    "interviewDate",
    "dateCompleted",
  ];
  const safeSortBy: SortableFields = allowedSortFields.includes(
    sortBy as SortableFields
  )
    ? (sortBy as SortableFields)
    : "createdAt";

  const [data, total] = await Promise.all([
    prisma.jobApplication.findMany({
      skip: offset,
      take: limit,
      orderBy: { [safeSortBy]: sortOrder },
    }),
    prisma.jobApplication.count(),
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

export const updateApplication = async (id: string, data: any) => {
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
