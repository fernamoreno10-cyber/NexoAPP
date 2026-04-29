import { cn } from '@/lib/utils'

type DotStatus = 'done' | 'active' | 'pending'

interface FlowDotsProps {
  completed: 0 | 1 | 2 | 3
  className?: string
}

function dotStatus(index: number, completed: number): DotStatus {
  if (completed > index) return 'done'
  if (completed === index) return 'active'
  return 'pending'
}

export function FlowDots({ completed, className }: FlowDotsProps) {
  const dots = [0, 1, 2]
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {dots.map((i) => {
        const status = dotStatus(i, completed)
        return (
          <div key={i} className="flex items-center gap-1">
            <div
              className={cn('w-2 h-2 rounded-full transition-colors', {
                'bg-teal-400': status === 'done',
                'bg-yellow-400 shadow-sm shadow-yellow-400/50': status === 'active',
                'bg-zinc-700': status === 'pending',
              })}
            />
            {i < 2 && (
              <div
                className={cn('w-3 h-px transition-colors', {
                  'bg-teal-400': completed > i,
                  'bg-zinc-700': completed <= i,
                })}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
