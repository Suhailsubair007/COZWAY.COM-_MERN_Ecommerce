import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send } from 'lucide-react'

export default function ReturnPopup({ open, onOpenChange, onSubmit }) {
  const [reason, setReason] = useState("")
  const [comments, setComments] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(reason, comments)
    setReason("")
    setComments("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground border-2 border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Return Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Return
            </Label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger id="reason" className="w-full border-2 border-input">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wrong-size">Wrong Size</SelectItem>
                <SelectItem value="defective">Defective Product</SelectItem>
                <SelectItem value="not-as-described">Not as Described</SelectItem>
                <SelectItem value="changed-mind">Changed My Mind</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium">
              Additional Comments
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px] border-2 border-input"
              placeholder="Please provide any additional details..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="mr-2 h-4 w-4" /> Submit Return Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
