-- 1. Create the new enum type for order statuses
CREATE TYPE public.order_status AS ENUM (
  'New Order',
  'Packed',
  'Shipped',
  'Completed',
  'Refunded'
);

-- 2. Add a new temporary column to the orders table
ALTER TABLE public.orders
ADD COLUMN status_new public.order_status;

-- 3. Update the new column based on the old status
--    We'll map the old 'paid' status to 'New Order'
UPDATE public.orders
SET status_new = 'New Order'
WHERE status = 'paid';

-- 4. Drop the old status column
ALTER TABLE public.orders
DROP COLUMN status;

-- 5. Rename the new column to 'status' and set a default
ALTER TABLE public.orders
RENAME COLUMN status_new TO status;

ALTER TABLE public.orders
ALTER COLUMN status SET DEFAULT 'New Order';
