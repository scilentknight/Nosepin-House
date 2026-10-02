-- Add a plain index on cartId first so the existing CartItem->Cart foreign key
-- has a supporting index to fall back on once the composite unique index is dropped
-- (avoids MySQL forcing us to drop+lose that foreign key entirely).
CREATE INDEX `CartItem_cartId_idx` ON `CartItem`(`cartId`);

-- DropIndex (was also enforcing "one cart line per product" — now enforced in app code
-- so a product can have separate cart lines per selected variant)
DROP INDEX `CartItem_cartId_productId_key` ON `CartItem`;

-- AlterTable
ALTER TABLE `CartItem` ADD COLUMN `variantId` INTEGER NULL;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `variantId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `CartItem_variantId_idx` ON `CartItem`(`variantId`);

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
