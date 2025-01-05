/*
  # Event Ticket Booking System Schema

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (timestamptz)
      - `location` (text)
      - `price` (numeric)
      - `available_tickets` (integer)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      
    - `tickets`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references auth.users)
      - `quantity` (integer)
      - `total_price` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Events can be read by anyone
    - Events can only be created by authenticated users
    - Tickets can only be read and created by authenticated users
*/

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  location text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  available_tickets integer NOT NULL CHECK (available_tickets >= 0),
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tickets table
CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Tickets policies
CREATE POLICY "Users can view their own tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase tickets"
  ON tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);