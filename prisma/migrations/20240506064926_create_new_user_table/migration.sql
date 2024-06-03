/*
  Warnings:

  - You are about to drop the `usernew` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `usernew`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
