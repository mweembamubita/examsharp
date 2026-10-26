'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Target, Flame, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProgressStatsProps {
  userId: string
}

interface StatItem {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
}

export function ProgressStats({ userId }: ProgressStatsProps) {
  const supabase = createClient()
  const [stats, setStats] = useState<StatItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get completed exams count
        const { count: completedCount } = await supabase
          .from('exam_attempts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_completed', true)

        // Get attempts with scores
        const { data: attempts, error: attemptsError } = await supabase
          .from('exam_attempts')
          .select('score, correct_answers, total_questions')
          .eq('user_id', userId)
          .eq('is_completed', true)

        let averageScore = 0
        let maxScore = 0

        if (!attemptsError && attempts && attempts.length > 0) {
          let totalScore = 0
          attempts.forEach((attempt) => {
            if (attempt.score !== null) {
              totalScore += attempt.score
              maxScore = Math.max(maxScore, attempt.score)
            }
          })
          averageScore = Math.round(totalScore / attempts.length)
        }

        setStats([
          {
            label: 'Exams Completed',
            value: completedCount || 0,
            icon: <BarChart3 className="w-6 h-6" />,
            color: 'bg-blue-500/10 text-blue-600',
          },
          {
            label: 'Average Accuracy',
            value: `${averageScore}%`,
            icon: <Target className="w-6 h-6" />,
            color: 'bg-green-500/10 text-green-600',
          },
          {
            label: 'Highest Score',
            value: `${maxScore}%`,
            icon: <Award className="w-6 h-6" />,
            color: 'bg-purple-500/10 text-purple-600',
          },
          {
            label: 'Current Streak',
            value: '0 days',
            icon: <Flame className="w-6 h-6" />,
            color: 'bg-orange-500/10 text-orange-600',
          },
        ])
      } catch (error) {
        console.error('Error loading progress stats:', error)
        setStats([
          {
            label: 'Exams Completed',
            value: 0,
            icon: <BarChart3 className="w-6 h-6" />,
            color: 'bg-blue-500/10 text-blue-600',
          },
          {
            label: 'Average Accuracy',
            value: '0%',
            icon: <Target className="w-6 h-6" />,
            color: 'bg-green-500/10 text-green-600',
          },
          {
            label: 'Highest Score',
            value: '0%',
            icon: <Award className="w-6 h-6" />,
            color: 'bg-purple-500/10 text-purple-600',
          },
          {
            label: 'Current Streak',
            value: '0 days',
            icon: <Flame className="w-6 h-6" />,
            color: 'bg-orange-500/10 text-orange-600',
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [userId, supabase])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 space-y-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
          <div>
            <p className="text-3xl font-bold text-foreground">{isLoading ? '--' : stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
