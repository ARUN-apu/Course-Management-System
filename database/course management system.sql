CREATE DATABASE course_management_system;
use course_management_system;

CREATE TABLE roles(
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO roles(name) 
VALUES
("Admin"),
("Instructor"), 
("Student");

SELECT * FROM roles;

CREATE TABLE users(
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
password_hash VARCHAR(100) NOT NULL,
role_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (role_id) REFERENCES roles(id)
);
ALTER TABLE users 
ADD COLUMN phone VARCHAR(15);

ALTER TABLE users
ADD CONSTRAINT phone UNIQUE (phone);

INSERT INTO users(name,email,password_hash,role_id)
VALUES
("Arun", "arun@gmail.com","arun@123",2),
("Apu", "apu@gmail.com", "apu@123", 3),
("Arup", "arup@gmail.com", "arup@123", 3);


UPDATE users SET phone = "8101436009" WHERE id = 1;
UPDATE users SET phone = "9000000010" WHERE id = 2;
UPDATE users SET phone = "8908080809" WHERE id = 3;
SELECT * FROM users;
 
CREATE TABLE instructors(
user_id INT PRIMARY KEY,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO instructors (user_id) VALUES (1);

SELECT * FROM instructors;

CREATE TABLE courses(
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(100) NOT NULL,
description VARCHAR(2000) NOT NULL,
instructor_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
course_fee DECIMAL(10,2) NOT NULL,
is_deleted BOOLEAN DEFAULT FALSE,
FOREIGN KEY(instructor_id) REFERENCES instructors(user_id)
);

INSERT INTO courses(title,description,instructor_id,course_fee)
VALUES 
('Web Development', 'complete web dev course', 1, 1999.00),
('Backend Development', 'Node and Database COurse', 1, 2499.00);

SELECT * FROM courses;

CREATE TABLE enrollments(
id INT PRIMARY KEY AUTO_INCREMENT,
student_id INT NOT NULL,
course_id INT NOT NULL,
enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
CONSTRAINT unique_enrollment UNIQUE (student_id, course_id)
); 

INSERT INTO enrollments (student_id, course_id)
VALUES
(2,1),
(3,2);

SELECT * FROM enrollments;

CREATE TABLE modules(
id INT PRIMARY KEY AUTO_INCREMENT,
course_id INT NOT NULL,
title VARCHAR(100) NOT NULL,
order_index INT NOT NULL,
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

INSERT INTO modules(course_id,title,order_index)
VALUES
(1,"HTML BASICS", 1),
(2,"NODE BASICS", 1);

SELECT * FROM modules;

CREATE TABLE lessons(
id INT PRIMARY KEY AUTO_INCREMENT,
module_id INT NOT NULL,
title VARCHAR(200) NOT NULL,
content_type ENUM('video', 'text') NOT NULL,
content_url TEXT,
order_index INT NOT NULL,
FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

INSERT INTO lessons (module_id, title, content_type, order_index) 
VALUES
(1, "Introduction to HTML", 'video', 1),
(2, "Introduction to Node", 'video', 1);

SELECT * FROM lessons;


CREATE TABLE lessons_progress(
id INT PRIMARY KEY AUTO_INCREMENT,
enrollment_id INT NOT NULL,
lesson_id INT NOT NULL,
is_completed BOOLEAN DEFAULT FALSE,
FOREIGN KEY(enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

INSERT INTO lessons_progress(enrollment_id,lesson_id)
VALUES
(1,1),
(2,2);

SELECT * FROM lessons_progress;

CREATE TABLE reviews(
id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT NOT NULL,
course_id INT NOT NULL,
rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE,
FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
CONSTRAINT unique_review UNIQUE (user_id, course_id)
);

INSERT INTO reviews (user_id,course_id, rating)
VALUES
(2,1,5),
(3,2,4);

SELECT * FROM reviews;

CREATE TABLE assignments(
id INT PRIMARY KEY AUTO_INCREMENT,
course_id INT NOT NULL,
instructor_id INT NOT NULL,
title VARCHAR(100) NOT NULL,
description TEXT,
due_date DATETIME NOT NULL,
is_complete BOOLEAN DEFAULT FALSE,
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
FOREIGN KEY (instructor_id) REFERENCES instructors(user_id) ON DELETE CASCADE
);

INSERT INTO assignments (course_id, instructor_id, title, description, due_date)
VALUES
(1,1,'Assignment 1', 'Completed HTML task', '2026-02-14 23:00:00'),
(2,1,'Assignment 2', 'Build simple API', '2026-02-14 23:00:00');

SELECT * FROM assignments;

CREATE TABLE submissions(
id INT PRIMARY KEY AUTO_INCREMENT,
assignment_id INT NOT NULL,
student_id INT NOT NULL,
submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO submissions (assignment_id,student_id) 
VALUES
(1,2),
(2,3);

SELECT * FROM submissions;

INSERT INTO courses (title, description, instructor_id, course_fee)
VALUES("React Course", "Complete React Course",  1, 2500.00);

INSERT INTO enrollments (student_id, course_id)
VALUES (2,3);

SELECT u.name, c.title FROM enrollments e
JOIN users u ON e.student_id = u.id
JOIN courses c ON e.course_id = c.id;

SELECT 
c.title as "Course Name",
u.name as "Teacher",
e.enrolled_at as "join Date"
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN instructors i ON c.instructor_id = i.user_id
JOIN users u ON i.user_id = u.id
WHERE e.student_id = 2;

UPDATE lessons_progress
SET is_completed = TRUE
WHERE enrollment_id = 1 AND lesson_id = 1;

DELETE FROM enrollments WHERE id = 1;

SELECT * FROM lessons_progress WHERE enrollment_id = 1;