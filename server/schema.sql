CREATE TABLE application (
  -- Identifier
  "permitApplicationNumber" TEXT NOT NULL,

  -- Automatically taken from the listings page
  "projectDescription" TEXT NOT NULL,
  "applicant" TEXT NOT NULL,
  "projectManagerName" TEXT NOT NULL,
  "projectManagerPhone" TEXT NOT NULL,
  "projectManagerEmail" TEXT NOT NULL,
  "publicNoticeDate" TEXT NOT NULL, -- yyyy-mm-dd
  "expirationDate" TEXT NOT NULL,   -- yyyy-mm-dd
  "publicNoticeUrl" TEXT NOT NULL,  -- On the Army Corps site
  "drawingsUrl" TEXT NOT NULL,      -- On the Army Corps site
  "parish" TEXT NOT NULL,

  -- Automatically taken from the public notice
  "CUP" TEXT NOT NULL,
  "WQC" TEXT NOT NULL,

  -- Manually taken from the listings page
  "longitude" FLOAT,
  "latitude" FLOAT,
  "acreage" FLOAT,

  -- Notes
  "type" TEXT NOT NULL,             -- impact mitigation restoration other
  "notes" TEXT NOT NULL,            -- Whatever
  "status" TEXT NOT NULL,           -- toRead,  toComment, waiting, toFOI or done 
  "flagged" INTEGER NOT NULL,       -- Either 0 or 1

  -- Key
  UNIQUE("permitApplicationNumber")
);

