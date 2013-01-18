CREATE TABLE application (
  -- Bookkeeping
  "permitApplicationNumber" TEXT NOT NULL,
  "pdfParsed" INTEGER,

  -- Automatically taken from the listings page
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

  -- Automatically taken from the public notice
  "CUP" TEXT NOT NULL,
  "WQC" TEXT NOT NULL,

  -- Manually taken from the listings page
  "longitude" FLOAT,
  "latitude" FLOAT,
  "acreage" FLOAT,

  -- Notes
  "type" TEXT NOT NULL,
  "notes" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "flagged" INTEGER NOT NULL,

  -- Key
  UNIQUE("permitApplicationNumber")
);

