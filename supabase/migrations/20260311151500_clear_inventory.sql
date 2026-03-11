-- Total Inventory Wipe Migration
-- As per requirements, removing existing test data using a migration file.
-- Since the schema relies heavily on frontend mocked state currently, this is safely guarded
-- to ensure it executes successfully against any existing 'inventory' table.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'inventory') THEN
        EXECUTE 'TRUNCATE TABLE public.inventory CASCADE;';
    END IF;
END $$;
