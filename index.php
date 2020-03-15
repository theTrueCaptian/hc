<?php
# This function reads your DATABASE_URL configuration automatically set by Heroku
# the return value is a string that will work with pg_connect
function pg_connection_string() {
  return  "dbname=dbpsu0p5m1q0kt host=ec2-54-225-135-30.compute-1.amazonaws.com port=5432 user=qtplrjwwlajlru password=ReRrKSl0A8-mILhyUgJ43A8C8d sslmode=require";
}
 
# Establish db connection
$db = pg_connect(pg_connection_string());
if (!$db) {
   echo "Database connection error."
   exit;
}
 
$result = pg_query($db, "SELECT statement goes here");
?>