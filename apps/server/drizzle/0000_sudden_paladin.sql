CREATE TABLE IF NOT EXISTS "bookmarket_bookmark" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"url" varchar(256) NOT NULL,
	"title" varchar(512) NOT NULL,
	"description" varchar(4000),
	"favicon_url" varchar(512),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
