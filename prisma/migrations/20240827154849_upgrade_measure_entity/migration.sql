/*
  Warnings:

  - Added the required column `measure_value` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Measure" (
    "measure_uuid" TEXT NOT NULL PRIMARY KEY,
    "measure_datetime" DATETIME NOT NULL,
    "measure_type" TEXT NOT NULL,
    "measure_value" DECIMAL NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "image_url" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    CONSTRAINT "Measure_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "Customer" ("customer_code") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Measure" ("customer_code", "has_confirmed", "image_url", "measure_datetime", "measure_type", "measure_uuid") SELECT "customer_code", "has_confirmed", "image_url", "measure_datetime", "measure_type", "measure_uuid" FROM "Measure";
DROP TABLE "Measure";
ALTER TABLE "new_Measure" RENAME TO "Measure";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
