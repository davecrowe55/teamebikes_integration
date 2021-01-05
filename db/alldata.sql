CREATE TABLE payload
(

	id SERIAL PRIMARY KEY,
	retailer_id int NOT NULL UNIQUE,
	user_id int NOT NULL UNIQUE,
	url "https://759827e72f05b9acbf7a0ec5acfd6b9c.m.pipedream.net",
	type active,
	

  

);