"use client"

interface Props {
  current: number
  goal: number
}

export default function ProgressBar({ current, goal }: Props) {
  const percentage = Math.min((current / goal) * 100, 100)

  return (
    <div className="space-y-2">
      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
        <div
          className="bg-green-600 h-4 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">
        R$ {current} de R$ {goal}
      </p>
    </div>
  )
}