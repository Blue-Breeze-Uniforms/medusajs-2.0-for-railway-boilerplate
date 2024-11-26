import { Migration } from '@mikro-orm/migrations';

export class Migration20241126092825 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "student" add column if not exists "grade" text not null, add column if not exists "student_school_id" text not null;');
    this.addSql('drop index if exists "IDX_student_student_id_unique";');
    this.addSql('alter table if exists "student" drop column if exists "age";');
    this.addSql('alter table if exists "student" drop column if exists "class";');
    this.addSql('alter table if exists "student" drop column if exists "school";');
    this.addSql('alter table if exists "student" drop column if exists "student_id";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_student_student_school_id_unique" ON "student" (student_school_id) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "student" add column if not exists "age" integer not null, add column if not exists "class" text not null, add column if not exists "school" text not null, add column if not exists "student_id" text not null;');
    this.addSql('drop index if exists "IDX_student_student_school_id_unique";');
    this.addSql('alter table if exists "student" drop column if exists "grade";');
    this.addSql('alter table if exists "student" drop column if exists "student_school_id";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_student_student_id_unique" ON "student" (student_id) WHERE deleted_at IS NULL;');
  }

}
