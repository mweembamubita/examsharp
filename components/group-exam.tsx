'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { useExamStore } from '@/lib/exam-store'
import { Button } from '@/components/ui/button'
import { Copy, Users, Check, X } from 'lucide-react'

interface GroupExamProps {
  examId: string
  examTitle: string
}

export function GroupExam({ examId, examTitle }: GroupExamProps) {
  const { user } = useAuthStore()
  const { createGroupExam, joinGroupExam, getUserGroupExams } = useExamStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [createdCode, setCreatedCode] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)

  const userGroupExams = user ? getUserGroupExams(user.id) : []
  const isAlreadyInGroup = userGroupExams.some((g) => g.examId === examId)

  const handleCreateGroup = () => {
    if (!user) return
    const code = createGroupExam(examId, user.id)
    setCreatedCode(code)
    setShowCreateModal(true)
  }

  const handleJoinGroup = () => {
    if (!user || !joinCode.trim()) return
    const success = joinGroupExam(joinCode, user.id, user.name)
    if (success) {
      setJoinCode('')
      setShowJoinModal(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Create/Join Section */}
      <div className="flex gap-2">
        <Button
          onClick={handleCreateGroup}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          <Users className="w-4 h-4 mr-2" />
          Create Group Exam
        </Button>
        <Button
          onClick={() => setShowJoinModal(true)}
          variant="outline"
          className="flex-1 border-border hover:bg-muted text-foreground"
        >
          Join Group Exam
        </Button>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="p-4 border border-border rounded-lg bg-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Group Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleJoinGroup}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Join
            </Button>
            <Button
              onClick={() => {
                setShowJoinModal(false)
                setJoinCode('')
              }}
              variant="outline"
              className="flex-1 border-border hover:bg-muted text-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Created Group Modal */}
      {showCreateModal && createdCode && (
        <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Share this code with others:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={createdCode}
                readOnly
                className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground font-mono text-center text-lg"
              />
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateModal(false)}
            variant="outline"
            className="w-full border-border hover:bg-muted text-foreground"
          >
            Done
          </Button>
        </div>
      )}

      {/* Group Status */}
      {isAlreadyInGroup && (
        <div className="p-4 bg-green-500/10 border border-green-200 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900">Group exam created</p>
            <p className="text-xs text-green-700">You can compare scores with other students</p>
          </div>
        </div>
      )}
    </div>
  )
}
