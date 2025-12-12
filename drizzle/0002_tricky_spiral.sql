ALTER TABLE "work_logs" RENAME COLUMN "date" TO "period";--> statement-breakpoint
ALTER TABLE "engineers" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "engineers" DROP COLUMN "email";