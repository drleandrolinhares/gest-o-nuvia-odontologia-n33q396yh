DO $$ 
BEGIN
  INSERT INTO public.cargos (nome, descricao) VALUES
    ('CRC COMERCIAL', 'Cargo CRC Comercial'),
    ('CRC LEAD E AGENDAMENTO', 'Cargo CRC Lead e Agendamento'),
    ('FINANCEIRO', 'Cargo Financeiro'),
    ('GERENTE ADM', 'Gerente Administrativo')
  ON CONFLICT (nome) DO NOTHING;
END $$;
