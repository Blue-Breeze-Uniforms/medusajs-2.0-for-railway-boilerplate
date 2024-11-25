import { Migration } from '@mikro-orm/migrations';

export class Migration20241125072126 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "student" ("id" text not null, "name" text not null, "age" integer not null, "class" text not null, "gender" text check ("gender" in (\'male\', \'female\')) not null default \'male\', "school" text not null, "customer_id" text not null, "student_id" text not null, "school_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "student_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_student_student_id_unique" ON "student" (student_id) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "student" cascade;');
  }

}
