-- CreateTable
CREATE TABLE `MunicipalityShippingRate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `municipalityId` INTEGER NOT NULL,
    `label` VARCHAR(191) NULL,
    `rate` DECIMAL(10, 2) NOT NULL,
    `freeShippingMinOrder` DECIMAL(10, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MunicipalityShippingRate_municipalityId_key`(`municipalityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MunicipalityShippingRate` ADD CONSTRAINT `MunicipalityShippingRate_municipalityId_fkey` FOREIGN KEY (`municipalityId`) REFERENCES `AddressBook`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
