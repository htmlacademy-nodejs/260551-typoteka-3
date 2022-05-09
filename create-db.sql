CREATE DATABASE typoteka
  WITH
  OWNER = postgres
  ENCODING = 'UTF8'
  LC_COLLATE = 'C'
  LC_CTYPE = 'C'
  TEMPLATE template0
  CONNECTION LIMIT = -1;

GRANT ALL ON DATABASE typoteka TO admin_typoteka;
