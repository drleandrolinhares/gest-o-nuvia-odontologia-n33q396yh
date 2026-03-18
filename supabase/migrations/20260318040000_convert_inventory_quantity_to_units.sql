-- Convert existing inventory quantity from packages to total units
UPDATE public.inventory
SET quantity = quantity * COALESCE(items_per_box, 1)
WHERE COALESCE(items_per_box, 1) > 1;

