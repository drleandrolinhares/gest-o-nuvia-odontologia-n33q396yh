DO $$
BEGIN
  -- Insert mock data for testing the vacation statuses
  INSERT INTO public.employees (name, role, department, status, vacation_due_date, email)
  VALUES 
    ('João Red (Ação Necessária)', 'Assistente', 'RH', 'Ativo', NOW() + INTERVAL '15 days', 'joaored@nuvia.local'),
    ('Maria Yellow (Programe-se)', 'Analista', 'RH', 'Ativo', NOW() + INTERVAL '60 days', 'mariayellow@nuvia.local'),
    ('Carlos Green (No Prazo)', 'Gerente', 'RH', 'Ativo', NOW() + INTERVAL '120 days', 'carlosgreen@nuvia.local');
END $$;
