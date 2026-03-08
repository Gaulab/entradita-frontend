"use client"

import PropTypes from "prop-types"
import { EyeIcon, LinkIcon, Share2, Trash2Icon, Printer } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function MobileActionDialog({
  ticket,
  onClose,
  copyToClipboard,
  handleShare,
  handleViewTicket,
  handleDeleteTicket,
  handlePrintTicket,
}) {
  if (!ticket) return null

  return (
    <Dialog open={!!ticket} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[400px] bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {ticket?.owner_name} {ticket?.owner_lastname}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {ticket?.ticket_tag.name}
            {ticket?.owner_dni && ` · DNI: ${ticket.owner_dni}`}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Button
            className="justify-start text-gray-200 hover:text-white hover:bg-gray-700"
            variant="ghost"
            onClick={() => { handleShare(ticket); onClose(); }}
          >
            <Share2 className="mr-2.5 h-4 w-4 text-gray-400" />
            Compartir ticket
          </Button>
          <Button
            className="justify-start text-gray-200 hover:text-white hover:bg-gray-700"
            variant="ghost"
            onClick={() => {
              copyToClipboard(`${window.location.origin}/ticket/${ticket?.uuid}`)
              onClose()
            }}
          >
            <LinkIcon className="mr-2.5 h-4 w-4 text-gray-400" />
            Copiar enlace
          </Button>
          <Button
            className="justify-start text-gray-200 hover:text-white hover:bg-gray-700"
            variant="ghost"
            onClick={() => { handleViewTicket(ticket?.uuid); onClose(); }}
          >
            <EyeIcon className="mr-2.5 h-4 w-4 text-gray-400" />
            Ver ticket
          </Button>
          {handlePrintTicket && (
            <Button
              className="justify-start text-gray-200 hover:text-white hover:bg-gray-700"
              variant="ghost"
              onClick={() => { handlePrintTicket(ticket); onClose(); }}
            >
              <Printer className="mr-2.5 h-4 w-4 text-gray-400" />
              Imprimir QR
            </Button>
          )}
          <div className="border-t border-gray-700 my-1" />
          <Button
            className="justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
            variant="ghost"
            onClick={() => { handleDeleteTicket(ticket); onClose(); }}
          >
            <Trash2Icon className="mr-2.5 h-4 w-4" />
            Eliminar ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

MobileActionDialog.propTypes = {
  ticket: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  copyToClipboard: PropTypes.func.isRequired,
  handleShare: PropTypes.func.isRequired,
  handleViewTicket: PropTypes.func.isRequired,
  handleDeleteTicket: PropTypes.func.isRequired,
  handlePrintTicket: PropTypes.func,
}
