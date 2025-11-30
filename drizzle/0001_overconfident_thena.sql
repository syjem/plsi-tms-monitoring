ALTER TABLE "work_logs" DROP CONSTRAINT "work_logs_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "work_logs" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "engineers" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "work_logs" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "work_logs" ADD CONSTRAINT "work_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;