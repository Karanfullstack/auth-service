import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantTables1731327086557 implements MigrationInterface {
   name = 'AddTenantTables1731327086557';

   public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
         `CREATE TABLE "tenants" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "address" character varying(255) NOT NULL, "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`,
      );

      await queryRunner.query(
         `ALTER TABLE "users" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`,
      );

      await queryRunner.query(
         `ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
      );

      await queryRunner.query(`ALTER TABLE "users" ADD "tenantId" integer`);

      await queryRunner.query(
         `ALTER TABLE "users" ADD CONSTRAINT "FK_c58f7e88c286e5e3478960a998b" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
         `ALTER TABLE "users" DROP CONSTRAINT "FK_c58f7e88c286e5e3478960a998b"`,
      );
      await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tenantId"`);
      await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
      await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updateAt"`);
      await queryRunner.query(`DROP TABLE "tenants"`);
   }
}
