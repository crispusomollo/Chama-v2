-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('SYSTEM', 'BUSINESS');

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "type" "RoleType" NOT NULL DEFAULT 'SYSTEM';
