-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "rest" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "biz" TEXT NOT NULL,
    "extra" TEXT,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);
