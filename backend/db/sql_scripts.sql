CREATE TABLE IF NOT EXISTS readers (
    id UUID PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    books UUID[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS books (
    id        UUID PRIMARY KEY,
    author    VARCHAR(100) NOT NULL,
    title     VARCHAR(100) NOT NULL,
    amount    INTEGER DEFAULT 0
);

---- READERS TABLE

-- GET
SELECT * FROM readers;

-- Книги заданного читателя
SELECT books FROM readers WHERE id = '6c409092-b7ec-11ee-8690-d79028b61534';

-- POST
INSERT INTO readers (id, full_name)
VALUES ('6c409092-b7ec-11ee-8690-d79028b61534', 'Яценко Николай Павлович');

-- PATCH изменение параметров читателя
UPDATE readers SET full_name = 'Яценко Николай Павлович' WHERE id = '6c409092-b7ec-11ee-8690-d79028b61534';
-- PATCH добавление книги к читателю
UPDATE readers SET books = array_append(books, '1f26e8e4-bc86-11ee-bdcb-773036f3d3a0') WHERE id = '6c409092-b7ec-11ee-8690-d79028b61534';
-- PATCH удаление книги из читателя
UPDATE readers SET books = array_remove(books, '1f26e8e4-bc86-11ee-bdcb-773036f3d3a0') WHERE id = '6c409092-b7ec-11ee-8690-d79028b61534';

-- DELETE
DELETE FROM readers WHERE id = '6c409092-b7ec-11ee-8690-d79028b61534';

---- BOOKS TABLE

-- GET
SELECT * from books;

-- POST
INSERT INTO books (id, author, title, amount)
VALUES ('1f26e8e4-bc86-11ee-bdcb-773036f3d3a0', 'Достоевский Федор Михайлович', 'Преступление и наказание', 0);

INSERT INTO books (id, author, title, amount)
VALUES ('ddd45876-bc86-11ee-a9e0-277cf3b29534', 'Гоголь Николай Васильевич', 'Мертвые души', 2);

-- PATCH
UPDATE books SET author = 'Достоевский Федор Михайлович' WHERE id = '1f26e8e4-bc86-11ee-bdcb-773036f3d3a0';
UPDATE books SET title = 'Преступление и наказание' WHERE id = '1f26e8e4-bc86-11ee-bdcb-773036f3d3a0';
UPDATE books SET amount = amount-1 WHERE id = '1f26e8e4-bc86-11ee-bdcb-773036f3d3a0';
