import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteColumnEmailPostTable1745636295249 implements MigrationInterface {
    name = 'DeleteColumnEmailPostTable1745636295249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`email\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`email\` varchar(255) NOT NULL`);
    }

}
