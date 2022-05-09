-- список всех категорий
SELECT * FROM categories

-- список категорий, для которых создана минимум одна публикация (идентификатор, наименование категории)
SELECT id, name FROM categories
    JOIN articles_categories
    ON  id = category_id
    GROUP BY id

-- список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории)
SELECT id, name, count(article_id) FROM categories
    LEFT JOIN articles_categories
    ON id = category_id
    GROUP BY id

-- список публикаций (идентификатор, заголовок, анонс, дата, имя и фамилия автора, email, количество комментариев, наименование категорий). Сначала свежие публикации
SELECT
    articles.id,
    articles.title,
    articles.announce,
    articles.created_at,
    users.first_name,
    users.last_name,
    users.email,
    STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
    COUNT(DISTINCT comments.id) AS comments_count
FROM articles
    JOIN articles_categories ON articles_categories.article_id = articles.id
    JOIN categories ON categories.id = articles_categories.category_id
    LEFT JOIN comments ON comments.article_id = articles.id
    JOIN users ON users.id = articles.user_id
GROUP BY articles.id, users.id, articles.created_at
ORDER BY articles.created_at DESC;

-- полная информация об определённой публикации (идентификатор, заголовок, анонс, полный текст, дата, путь к изображению, имя и фамилия автора, email, количество комментариев, наименование категорий)
SELECT
    articles.id,
    articles.title,
    articles.announce,
    articles.full_text,
    articles.created_at,
    articles.picture,
    users.first_name,
    users.last_name,
    users.email,
    STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
    COUNT(DISTINCT comments.id) AS comments_count
FROM articles
    JOIN articles_categories ON articles_categories.article_id = articles.id
    JOIN categories ON categories.id = articles_categories.category_id
    LEFT JOIN comments ON comments.article_id = articles.id
    JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
GROUP BY articles.id, users.id, articles.created_at

-- список из 5 свежих комментариев (идентификатор, идентификатор публикации, имя и фамилия автора, текст комментария)
SELECT
    comments.id,
    comments.article_id,
    comments.text,
    users.first_name,
    users.last_name
FROM comments
    JOIN users ON users.id = comments.user_id
ORDER BY comments.created_at DESC
LIMIT 5

-- список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии.
SELECT
    comments.id,
    comments.article_id,
    users.first_name,
    users.last_name,
    comments.text
FROM comments
    JOIN users ON users.id = comments.user_id
WHERE comments.article_id = 1
ORDER BY comments.created_at DESC

-- обновить заголовок определённой публикации на «Как я встретил Новый год»
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE articles.id = 1
