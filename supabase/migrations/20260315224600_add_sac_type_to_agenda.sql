-- Make sure the constraint on agenda type allows SAC if there is any hardcoded constraint
-- In this project, agenda type is a text field without a rigid CHECK constraint natively,
-- but adding it to the UI was done via AppStore. 
-- No schema changes required for agenda table specifically for the type.
-- This file exists to ensure we have a valid migration if anything else was missed.
SELECT 1;
