"use client"

import PropTypes from "prop-types"
import { EyeIcon, LinkIcon, Share2, Trash2Icon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function MobileActionDialog({
  ticket,
  onClose,
  copyToClipboard,
  handleShare,
  handleViewTicket,
  handleDeleteTicket,
}) {
  if (!ticket) return null

  return (
    <Dialog className="" open={!!ticket} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 ">
        <DialogHeader>
          <DialogTitle>Acciones para el ticket</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-0 m-0">
          Selecciona una accion para realizar sobre el ticket de:
        </DialogDescription>
        <div className="text-gray-300">
          <p>
            <strong>Nombre:</strong> {ticket?.owner_name} {ticket?.owner_lastname}
          </p>
          {ticket?.owner_dni && (
            <p>
              <strong>DNI:</strong> {ticket?.owner_dni ? ticket.owner_dni : "No disponible"}
            </p>
          )}
          <p>
            <strong>Tipo:</strong> {ticket?.ticket_tag.name}
          </p>
        </div>
        <div className="flex flex-col space-y-2 m-0">
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              onClose()
              copyToClipboard(`${window.location.origin}/ticket/${ticket?.uuid}`)
            }}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Copiar enlace del ticket
          </Button>
          <Button className="justify-start" variant="entraditaSecondary" onClick={() => handleShare(ticket)}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartir ticket
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              window.open(`/ticket/${ticket?.uuid}`, "_blank")
              onClose()
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            Ver página de ticket
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              handleDeleteTicket(ticket)
              onClose()
            }}
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
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
}
