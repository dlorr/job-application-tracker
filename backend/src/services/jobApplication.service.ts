import { prisma } from "../prisma";
import { ApiError } from "../errors/apiError";
import { NOT_FOUND } from "../constants/http";

export const createApplication = (data: any) => {
  return prisma.jobApplication.create({
    data: {
      ...data,
      dateApplied: new Date(),
    },
  });
};

export const getAllApplications = () => {
  return prisma.jobApplication.findMany({
    orderBy: { dateApplied: "desc" },
  });
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
