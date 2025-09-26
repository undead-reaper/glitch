CREATE TYPE "public"."video_visibility" AS ENUM('private', 'public', 'unlisted');--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "mux_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "duration" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "duration" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "visibility" "video_visibility" DEFAULT 'private' NOT NULL;