import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitData1669925888676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO users (name, email, password) values ('john doe', 'john@doe.com', '$2b$10$ifmBIYlyPDgSvEAxpqIMVunaDClhxn../flmhgSa9JxGnymxQ2l3y')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE email like 'john@doe.com'`,
    );
  }
}
