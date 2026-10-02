-- AlterTable
ALTER TABLE `address` DROP COLUMN `city`,
    DROP COLUMN `email`,
    DROP COLUMN `line2`,
    DROP COLUMN `postalCode`,
    DROP COLUMN `state`,
    ADD COLUMN `addressType` ENUM('HOME', 'OFFICE', 'OTHER') NOT NULL DEFAULT 'HOME',
    ADD COLUMN `landmark` VARCHAR(191) NULL,
    ADD COLUMN `municipalityId` INTEGER NULL,
    ADD COLUMN `provinceId` INTEGER NULL,
    ADD COLUMN `wardNo` INTEGER NULL;

-- CreateTable
CREATE TABLE `AddressBook` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parentId` INTEGER NULL,
    `level` ENUM('PROVINCE', 'DISTRICT', 'MUNICIPALITY') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `municipalityType` ENUM('METROPOLITAN', 'SUB_METROPOLITAN', 'MUNICIPALITY', 'RURAL_MUNICIPALITY') NULL,
    `wardCount` INTEGER NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AddressBook_parentId_idx`(`parentId`),
    INDEX `AddressBook_level_idx`(`level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Address_provinceId_idx` ON `Address`(`provinceId`);

-- CreateIndex
CREATE INDEX `Address_municipalityId_idx` ON `Address`(`municipalityId`);

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `AddressBook`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_municipalityId_fkey` FOREIGN KEY (`municipalityId`) REFERENCES `AddressBook`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AddressBook` ADD CONSTRAINT `AddressBook_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `AddressBook`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
