import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import useAppStore from '@/stores/main'

export function ExplanationPopover() {
  const { isMaster, isAdmin, inventoryOptions, updateInventoryOption, addInventoryOption } =
    useAppStore()
  const canEdit = isMaster || isAdmin

  const option =
    inventoryOptions?.find(
      (o) => o.category === 'field_explanation' && o.value === 'REFERENCIA_CONSUMO',
    ) ?? null
  const defaultText =
    'ESCOLHA SE O CONSUMO DESTE ITEM SERÁ CONTABILIZADO POR EMBALAGEM (QTD. COMPRADA) OU POR UNIDADE (ITENS NA EMBALAGEM).'
  const text = option?.label || defaultText

  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text)

  const handleSave = async () => {
    if (option) {
      await updateInventoryOption(option.id, editText)
    } else {
      addInventoryOption('field_explanation', 'REFERENCIA_CONSUMO', editText)
    }
    setIsEditing(false)
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={(val) => {
        setIsOpen(val)
        if (!val) {
          setIsEditing(false)
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-full w-[18px] h-[18px] inline-flex items-center justify-center bg-[#D81B84]/10 text-[#D81B84] hover:bg-[#D81B84]/20 transition-colors ml-2"
          onMouseEnter={() => !isOpen && setIsOpen(true)}
        >
          <span className="text-[11px] font-black">!</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4 z-[9999]"
        onMouseLeave={() => !isEditing && setIsOpen(false)}
      >
        {isEditing ? (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase">EDITAR EXPLICAÇÃO</h4>
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="text-xs min-h-[100px] uppercase"
            />
            <div className="flex justify-end gap-2 border-t pt-3 mt-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                CANCELAR
              </Button>
              <Button
                size="sm"
                className="bg-[#D81B84] hover:bg-[#B71770] text-white"
                onClick={handleSave}
              >
                SALVAR
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-semibold leading-relaxed text-slate-700 uppercase">{text}</p>
            {canEdit && (
              <div className="flex justify-end border-t pt-2 mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[10px] text-muted-foreground"
                  onClick={() => {
                    setEditText(text)
                    setIsEditing(true)
                  }}
                >
                  EDITAR TEXTO
                </Button>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    