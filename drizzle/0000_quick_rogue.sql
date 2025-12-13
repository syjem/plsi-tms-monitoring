CREATE TABLE "engineers" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "engineers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text,
	"title" text,
	"signature" text,
	"phone" varchar(50),
	"email" text,
	"user_id" uuid NOT NULL,
	"field_number" smallint,
	CONSTRAINT "field_number_check" CHECK ("engineers"."field_number" > 0)
);
--> statement-breakpoint
ALTER TABLE "engineers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "work_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"date" text NOT NULL,
	"logs" jsonb NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "work_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "engineers" ADD CONSTRAINT "engineers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_logs" ADD CONSTRAINT "work_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Engineers can insert their own record" ON "engineers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((SELECT auth.uid()) = user_id);--> statement-breakpoint
CREATE POLICY "Engineers can update their own record" ON "engineers" AS PERMISSIVE FOR UPDATE TO "authenticated" WITH CHECK ((SELECT auth.uid()) = user_id);--> statement-breakpoint
CREATE POLICY "Engineers can view their own record" ON "engineers" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((SELECT auth.uid()) = user_id);--> statement-breakpoint
CREATE POLICY "Authenticated users can delete their own record" ON "work_logs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((SELECT auth.uid() as uid) = user_id);--> statement-breakpoint
CREATE POLICY "Authenticated users can update their own record" ON "work_logs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((SELECT auth.uid() as uid) = user_id) WITH CHECK ((SELECT auth.uid() as uid) = user_id);--> statement-breakpoint
CREATE POLICY "Enable insert based on user_id" ON "work_logs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() = user_id);--> statement-breakpoint
CREATE POLICY "Enable select for users based on user_id" ON "work_logs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((SELECT auth.uid() as uid) = user_id);