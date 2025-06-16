select * from post;
--@block
UPDATE post
SET thumbnails = '["http://10.0.2.2:8081/uploads/avatar/1748621685592-0201vocabulary.jpeg",
"http://10.0.2.2:8081/uploads/avatar/1748621685592-0201vocabulary.jpeg",
"http://10.0.2.2:8081/uploads/avatar/1748621685592-0201vocabulary.jpeg",
"http://10.0.2.2:8081/uploads/avatar/1748621685592-0201vocabulary.jpeg",
"http://10.0.2.2:8081/uploads/avatar/1748621685592-0201vocabulary.jpeg",
"http://10.0.2.2:8081/uploads/avatar/1748621685592-0201vocabulary.jpeg",
"http://10.0.2.2:8081/uploads/avatar/1748621685592-0201vocabulary.jpeg",
"http://10.0.2.2:8081/uploads/avatar/1748621685592-0201vocabulary.jpeg"]'
WHERE id = 6;