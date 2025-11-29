/*
  Warnings:

  - You are about to alter the column `inferStep` on the `AISongDetails` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `inferStep` on table `AISongDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guidanceScale` on table `AISongDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guidanceScaleText` on table `AISongDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guidanceScaleLyric` on table `AISongDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schedulerType` on table `AISongDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cfgType` on table `AISongDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guidanceInterval` on table `AISongDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `guidanceIntervalDecay` on table `AISongDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seed` on table `AISongDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AISongDetails" ALTER COLUMN "inferStep" SET NOT NULL,
ALTER COLUMN "inferStep" SET DEFAULT 60,
ALTER COLUMN "inferStep" SET DATA TYPE INTEGER,
ALTER COLUMN "guidanceScale" SET NOT NULL,
ALTER COLUMN "guidanceScale" SET DEFAULT 15.0,
ALTER COLUMN "guidanceScaleText" SET NOT NULL,
ALTER COLUMN "guidanceScaleText" SET DEFAULT 0.0,
ALTER COLUMN "guidanceScaleLyric" SET NOT NULL,
ALTER COLUMN "guidanceScaleLyric" SET DEFAULT 0.0,
ALTER COLUMN "schedulerType" SET NOT NULL,
ALTER COLUMN "schedulerType" SET DEFAULT 'euler',
ALTER COLUMN "useErgTag" SET DEFAULT true,
ALTER COLUMN "useErgLyric" SET DEFAULT true,
ALTER COLUMN "useErgDiffusion" SET DEFAULT true,
ALTER COLUMN "cfgType" SET NOT NULL,
ALTER COLUMN "cfgType" SET DEFAULT 'apg',
ALTER COLUMN "guidanceInterval" SET NOT NULL,
ALTER COLUMN "guidanceInterval" SET DEFAULT 0.5,
ALTER COLUMN "guidanceIntervalDecay" SET NOT NULL,
ALTER COLUMN "guidanceIntervalDecay" SET DEFAULT 0.0,
ALTER COLUMN "seed" SET NOT NULL,
ALTER COLUMN "seed" SET DEFAULT -1;

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "duration" SET DEFAULT 150.0;
