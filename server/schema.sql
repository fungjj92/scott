CREATE TABLE application (
  -- Bookkeeping
  "permitApplicationNumber" TEXT NOT NULL,
  "pdfParsed" INTEGER,

  -- Automatic
  "projectDescription" TEXT NOT NULL,
  "applicant" TEXT NOT NULL,
  "projectManagerName" TEXT NOT NULL,
  "projectManagerPhone" TEXT NOT NULL,
  "projectManagerEmail" TEXT NOT NULL,
  "publicNoticeDate" TEXT NOT NULL,
  "expirationDate" TEXT NOT NULL,
  "publicNoticeUrl" TEXT NOT NULL,
  "drawingsUrl" TEXT NOT NULL,
  "parish" TEXT NOT NULL,
  "CUP" TEXT NOT NULL,
  "WQC" TEXT NOT NULL,

  -- Manual
  "longitude" FLOAT,
  "latitude" FLOAT,
  "acreage" FLOAT,
  "notes" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "flagged" INTEGER NOT NULL,
  UNIQUE("permitApplicationNumber")
);

