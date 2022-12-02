import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitData1669925888676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO organizations (name) values ('Doe Org')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM organizations WHERE name like 'Doe Org'`,
    );
  }
}
