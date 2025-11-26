CREATE TABLE "engineers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text,
	"title" text,
	"signature" text,
	"phone" varchar(50),
	"fieldNumber" smallint,
	CONSTRAINT "field_number_check" CHECK ("engineers"."fieldNumber" > 0)
);
--> statement-breakpoint
CREATE TABLE "work_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"date" text NOT NULL,
	"logs" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "engineers" ADD CONSTRAINT "engineers_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_logs" ADD CONSTRAINT "work_logs_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;