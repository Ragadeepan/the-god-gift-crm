-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "instagram_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_whatsapp_number_key" ON "customers"("whatsapp_number");
