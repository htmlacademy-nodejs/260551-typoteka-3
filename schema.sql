DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles_categories;

CREATE TABLE roles(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(10) NOT NULL
);

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  avatar varchar(50) NOT NULL,
  role_id integer NOT NULL DEFAULT 1,
  FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE SET DEFAULT
    ON UPDATE SET DEFAULT
);

CREATE TABLE articles(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  picture varchar(50),
  announce varchar(255),
  full_text text NOT NULL,
  user_id integer,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  article_id integer NOT NULL,
  user_id integer NOT NULL,
  text text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE articles_categories(
  article_id integer NOT NULL,
  category_id integer NOT NULL,
  CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX ON articles(title);
