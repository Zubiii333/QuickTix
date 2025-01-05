/*
  # Add payment status to tickets

  1. Changes
    - Add payment_status column to tickets table with type text
    - Set default value to 'pending'
    - Add check constraint to ensure valid status values
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tickets' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE tickets 
    ADD COLUMN payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid'));
  END IF;
END $$;