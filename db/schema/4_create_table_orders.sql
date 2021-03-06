DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  time_placed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  time_ready TIMESTAMP DEFAULT NULL,
  picked_up BOOLEAN DEFAULT false
);

GRANT ALL PRIVILEGES ON TABLE orders TO labber;

GRANT ALL ON SEQUENCE orders_id_seq TO labber;
