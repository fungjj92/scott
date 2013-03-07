-- I manually copied the results of this query.
.mode column
.width 70 10 10 10 10 10 10 70 10
SELECT permitApplicationNumber,CUP,WQC,longitude,latitude,acreage,type,notes,status FROM application WHERE status != 1; 
