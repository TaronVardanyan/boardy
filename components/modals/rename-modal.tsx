'use client'

import { useState, useEffect, FormEventHandler } from 'react'
import { useRenameModal } from '@/store/use-rename-modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'

const RenameModal = () => {
  const { mutate, pending } = useApiMutation(api.board.update)
  const { isOpen, onClose, initialValues } = useRenameModal()
  const [title, setTitle] = useState(initialValues.title)

  useEffect(() => {
    setTitle(initialValues.title)
  }, [initialValues.title])

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    await mutate({
      id: initialValues.id,
      title,
    })
      .then(() => {
        toast.success('Board renamed')
        onClose()
      })
      .catch(() => toast.error('Failed to rename board'))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit board title</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a new title for this board.</DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            disabled={pending}
            maxLength={60}
            required={true}
            value={title}
            placeholder="Board title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RenameModal
