-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'VIEWED', 'IN_PROGRESS', 'REJECTED', 'GHOSTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ApplicationProgress" AS ENUM ('INITIAL_INTERVIEW', 'TECHNICAL_INTERVIEW', 'TECHNICAL_EXAM', 'FINAL_INTERVIEW', 'JOB_OFFER');

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jobPosition" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "progress" "ApplicationProgress",
    "interviewDate" TIMESTAMP(3),
    "hasForm" BOOLEAN NOT NULL DEFAULT false,
    "jobLink" TEXT,
    "dateApplied" TIMESTAMP(3) NOT NULL,
    "dateCompleted" TIMESTAMP(3),
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);
