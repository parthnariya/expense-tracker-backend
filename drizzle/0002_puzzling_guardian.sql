ALTER TABLE "spaces" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;