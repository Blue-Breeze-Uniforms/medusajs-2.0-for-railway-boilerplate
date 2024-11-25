import { Migration } from '@mikro-orm/migrations';

export class Migration20241125072053 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "school" ("id" text not null, "name" text not null, "shortName" text not null default \'\', "type" text check ("type" in (\'primary\', \'secondary\', \'higher\', \'vocational\', \'university\')) not null, "address" text null, "city" text not null, "state" text not null, "country" text not null, "postalCode" text not null, "website" text null, "studentCount" numeric not null default 0, "principalName" text null, "contactPersonName" text null, "contactPersonEmail" text null, "contactPersonPhone" text null, "isActive" boolean not null default true, "logo" text null, "raw_studentCount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "school_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_school_name_unique" ON "school" (name) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "school" cascade;');
  }

}
