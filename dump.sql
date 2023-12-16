-- ----------------------------
-- Table structure for profiles
-- ----------------------------
DROP TABLE IF EXISTS "public"."profiles";
CREATE TABLE "public"."profiles" (
  "id" uuid NOT NULL,
  "updated_at" timestamptz(6),
  "username" text COLLATE "pg_catalog"."default",
  "full_name" text COLLATE "pg_catalog"."default",
  "avatar_url" text COLLATE "pg_catalog"."default",
  "website" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."profiles" OWNER TO "postgres";

-- ----------------------------
-- Table structure for round
-- ----------------------------
DROP TABLE IF EXISTS "public"."round";
CREATE TABLE "public"."round" (
  "id" int8 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
),
  "profile_id" uuid NOT NULL,
  "log" text COLLATE "pg_catalog"."default",
  "did_win" bool,
  "character_type" text COLLATE "pg_catalog"."default",
  "metadata" jsonb,
  "timestamp" timestamptz(6),
  "embedding" "extensions"."vector",
  "summary" text COLLATE "pg_catalog"."default",
  "summarytitle" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."round" OWNER TO "postgres";

-- ----------------------------
-- Function structure for handle_new_user
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."handle_new_user"();
CREATE OR REPLACE FUNCTION "public"."handle_new_user"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;
ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."round_id_seq"
OWNED BY "public"."round"."id";
SELECT setval('"public"."round_id_seq"', 48, true);

-- ----------------------------
-- Uniques structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");

-- ----------------------------
-- Checks structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "username_length" CHECK (char_length(username) >= 3);

-- ----------------------------
-- Primary Key structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table round
-- ----------------------------
ALTER TABLE "public"."round" ADD CONSTRAINT "round_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table round
-- ----------------------------
ALTER TABLE "public"."round" ADD CONSTRAINT "round_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
