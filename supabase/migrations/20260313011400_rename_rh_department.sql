UPDATE public.employees
SET department = 'RH'
WHERE department ILIKE 'recursos humanos';

UPDATE public.chat_rooms
SET department = 'RH'
WHERE department ILIKE 'recursos humanos';

UPDATE public.chat_rooms
SET name = 'RH'
WHERE name ILIKE 'recursos humanos' AND type = 'group';

UPDATE public.onboarding
SET department = 'RH'
WHERE department ILIKE 'recursos humanos';
