import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialBookmarkTable1740000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "bookmark" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "url" character varying NOT NULL,
        "title" character varying NOT NULL,
        "description" character varying NOT NULL,
        "faviconUrl" character varying NOT NULL,
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_bookmark_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "bookmark"');
  }
}