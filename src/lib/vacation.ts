import { differenceInDays, isValid, parseISO } from 'date-fns'

export function getVacationStatus(dueDate?: string | null) {
  if (!dueDate || !isValid(parseISO(dueDate))) {
    return {
      status: 'unknown',
      days: 0,
      colorClass: 'bg-muted/50 border-muted text-muted-foreground',
      badgeClass: 'bg-muted text-muted-foreground border-transparent',
      phrase: 'NÃO DEFINIDO',
      iconColor: 'text-muted-foreground',
    }
  }

  const days = differenceInDays(parseISO(dueDate), new Date())

  if (days > 90) {
    return {
      status: 'ok',
      days,
      colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      badgeClass: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200',
      phrase: 'NO PRAZO',
      iconColor: 'text-emerald-600',
    }
  } else if (days > 30) {
    return {
      status: 'warning',
      days,
      colorClass: 'bg-amber-50 border-amber-200 text-amber-800',
      badgeClass: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200',
      phrase: 'PROGRAME-SE: FÉRIAS CHEGANDO',
      iconColor: 'text-amber-600',
    }
  } else {
    return {
      status: 'critical',
      days,
      colorClass: 'bg-red-50 border-red-200 text-red-800',
      badgeClass: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200',
      phrase: 'MÊS DE FÉRIAS: AÇÃO NECESSÁRIA',
      iconColor: 'text-red-600',
    }
  }
}
