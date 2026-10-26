'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  explanations?: string[] // Explanation for each wrong answer
}

export interface ExamPaper {
  id: string
  title: string
  subject: string
  grade: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questions: number
  duration: number
  totalQuestions?: Question[]
}

export interface ExamAttempt {
  id: string
  examId: string
  userId: string
  answers: number[] // Selected answer indices
  score: number
  accuracy: number
  completedAt: string
  timeSpent: number
}

export interface GroupExam {
  id: string
  code: string
  examId: string
  creatorId: string
  createdAt: string
  participants: {
    userId: string
    name: string
    score?: number
    accuracy?: number
    completed: boolean
  }[]
}

export interface ExamStore {
  examPapers: ExamPaper[]
  attempts: ExamAttempt[]
  groupExams: GroupExam[]
  createGroupExam: (examId: string, userId: string) => string
  joinGroupExam: (code: string, userId: string, userName: string) => boolean
  submitExamAttempt: (attempt: ExamAttempt) => void
  getAttemptById: (id: string) => ExamAttempt | undefined
  getUserAttempts: (userId: string) => ExamAttempt[]
  getUserGroupExams: (userId: string) => GroupExam[]
  updateGroupExamScore: (groupId: string, userId: string, score: number, accuracy: number) => void
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      examPapers: [
        {
          id: '1',
          title: 'Algebra Fundamentals',
          subject: 'Mathematics',
          grade: 'Grade 9',
          difficulty: 'Easy',
          questions: 25,
          duration: 60,
          totalQuestions: [
            {
              id: 'q1',
              question: 'What is 2 + 2?',
              options: ['2', '3', '4', '5'],
              correctAnswer: 2,
              explanation: 'When you add 2 and 2, you get 4.',
              explanations: [
                'This is too low.',
                'This is one less than the correct answer.',
                'This is correct!',
              ],
            },
            {
              id: 'q2',
              question: 'Solve: 3x = 12',
              options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
              correctAnswer: 2,
              explanation: 'Divide both sides by 3: 12 ÷ 3 = 4, so x = 4.',
              explanations: [
                'Dividing by 3 would give x = 4, not 2.',
                'Dividing 12 by 3 gives 4, not 3.',
                'This is the correct answer.',
              ],
            },
          ],
        },
        {
          id: '2',
          title: 'Physics Basics',
          subject: 'Science',
          grade: 'Grade 10',
          difficulty: 'Medium',
          questions: 30,
          duration: 90,
          totalQuestions: [
            {
              id: 'q3',
              question: 'What is the SI unit of force?',
              options: ['Joule', 'Newton', 'Pascal', 'Watt'],
              correctAnswer: 1,
              explanation: 'Newton is the SI unit of force, named after Isaac Newton.',
              explanations: [
                'Joule is the unit of energy.',
                'This is correct.',
                'Pascal is the unit of pressure.',
                'Watt is the unit of power.',
              ],
            },
          ],
        },
        {
          id: '3',
          title: 'English Literature',
          subject: 'English',
          grade: 'Grade 10',
          difficulty: 'Medium',
          questions: 28,
          duration: 75,
        },
        {
          id: '4',
          title: 'Biology Basics',
          subject: 'Science',
          grade: 'Grade 9',
          difficulty: 'Easy',
          questions: 45,
          duration: 120,
        },
        {
          id: '5',
          title: 'History: Medieval Period',
          subject: 'History',
          grade: 'Grade 10',
          difficulty: 'Medium',
          questions: 35,
          duration: 100,
        },
        {
          id: '6',
          title: 'Advanced Calculus',
          subject: 'Mathematics',
          grade: 'Grade 12',
          difficulty: 'Hard',
          questions: 20,
          duration: 120,
        },
      ],
      attempts: [],
      groupExams: [],

      createGroupExam: (examId: string, userId: string) => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase()
        const groupExam: GroupExam = {
          id: uuidv4(),
          code,
          examId,
          creatorId: userId,
          createdAt: new Date().toISOString(),
          participants: [
            {
              userId,
              name: 'You',
              completed: false,
            },
          ],
        }
        set((state) => ({
          groupExams: [...state.groupExams, groupExam],
        }))
        return code
      },

      joinGroupExam: (code: string, userId: string, userName: string) => {
        const state = get()
        const groupExam = state.groupExams.find((g) => g.code === code)

        if (!groupExam) return false

        // Check if already joined
        if (groupExam.participants.some((p) => p.userId === userId)) {
          return true
        }

        groupExam.participants.push({
          userId,
          name: userName,
          completed: false,
        })

        set({ groupExams: [...state.groupExams] })
        return true
      },

      submitExamAttempt: (attempt: ExamAttempt) => {
        set((state) => ({
          attempts: [...state.attempts, attempt],
        }))
      },

      getAttemptById: (id: string) => {
        return get().attempts.find((a) => a.id === id)
      },

      getUserAttempts: (userId: string) => {
        return get().attempts.filter((a) => a.userId === userId)
      },

      getUserGroupExams: (userId: string) => {
        return get().groupExams.filter((g) =>
          g.participants.some((p) => p.userId === userId)
        )
      },

      updateGroupExamScore: (groupId: string, userId: string, score: number, accuracy: number) => {
        set((state) => ({
          groupExams: state.groupExams.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  participants: g.participants.map((p) =>
                    p.userId === userId
                      ? { ...p, score, accuracy, completed: true }
                      : p
                  ),
                }
              : g
          ),
        }))
      },
    }),
    {
      name: 'examsharp-exams',
    }
  )
)
