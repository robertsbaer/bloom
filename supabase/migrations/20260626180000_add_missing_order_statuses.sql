ALTER TYPE public.order_status ADD VALUE 'Pending' BEFORE 'New Order';
ALTER TYPE public.order_status ADD VALUE 'Failed';
ALTER TYPE public.order_status ADD VALUE 'Canceled';
