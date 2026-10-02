-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_provinceId_fkey`;

-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_municipalityId_fkey`;

-- AlterTable
ALTER TABLE `Address`
    MODIFY COLUMN `provinceId` INTEGER NOT NULL,
    MODIFY COLUMN `municipalityId` INTEGER NOT NULL,
    MODIFY COLUMN `wardNo` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `AddressBook`(`id`) ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_municipalityId_fkey` FOREIGN KEY (`municipalityId`) REFERENCES `AddressBook`(`id`) ON UPDATE CASCADE;
