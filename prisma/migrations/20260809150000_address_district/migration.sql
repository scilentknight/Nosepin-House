-- AlterTable: add nullable first so existing rows survive, backfill from the
-- municipality's own parent district (derivable, no guessing needed), then tighten.
ALTER TABLE `Address` ADD COLUMN `districtId` INTEGER NULL;

UPDATE `Address` a
JOIN `AddressBook` m ON a.`municipalityId` = m.`id`
SET a.`districtId` = m.`parentId`;

ALTER TABLE `Address` MODIFY COLUMN `districtId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Address_districtId_idx` ON `Address`(`districtId`);

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_districtId_fkey` FOREIGN KEY (`districtId`) REFERENCES `AddressBook`(`id`) ON UPDATE CASCADE;
