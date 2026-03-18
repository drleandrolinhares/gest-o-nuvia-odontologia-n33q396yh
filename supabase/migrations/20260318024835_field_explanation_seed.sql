DO $
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.inventory_settings WHERE category = 'field_explanation' AND value = 'REFERENCIA_CONSUMO') THEN
    INSERT INTO public.inventory_settings (category, value, label)
    VALUES ('field_explanation', 'REFERENCIA_CONSUMO', 'ESCOLHA SE O CONSUMO DESTE ITEM SERÁ CONTABILIZADO POR EMBALAGEM (QTD. COMPRADA) OU POR UNIDADE (ITENS NA EMBALAGEM).');
  END IF;
END $;

