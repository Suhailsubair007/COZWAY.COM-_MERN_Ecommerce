import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ReturnRequestModal({ isOpen, onClose, returnRequest, onApprove, onReject }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return Request Details</DialogTitle>
          <DialogDescription>
            Review the return request details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h3 className="font-medium">Reason:</h3>
            <p>{returnRequest.reason}</p>
          </div>
          <div>
            <h3 className="font-medium">Comment:</h3>
            <p>{returnRequest.comment}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onReject} variant="outline">
            Reject
          </Button>
          <Button onClick={onApprove}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
