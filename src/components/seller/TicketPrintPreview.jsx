"use client"

import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Scissors } from "lucide-react"
import html2canvas from "html2canvas"
import { formatDate } from "../../utils/dateUtils"

export default function TicketPrintPreview({ ticket, qrRef, dniRequired, onClose, vendedor }) {
  const [qrImageUrl, setQrImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const captureQR = async () => {
      if (!qrRef.current) return

      try {
        setIsLoading(true)
        const canvas = await html2canvas(qrRef.current, {
          scale: 4,
          backgroundColor: null,
        })
        setQrImageUrl(canvas.toDataURL("image/png"))
      } catch (err) {
        console.error("Error al capturar QR:", err)
      } finally {
        setIsLoading(false)
      }
    }

    captureQR()
  }, [qrRef])

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600")
    if (!printWindow) {
      alert("Por favor, permite las ventanas emergentes para imprimir el ticket.")
      return
    }

    const eventDate = ticket.event_date ? formatDate(new Date(ticket.event_date)) : "Fecha no disponible"
    const ticketDate = formatDate(new Date(ticket.created_at))

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket - ${ticket.owner_name} ${ticket.owner_lastname}</title>
          <meta charset="UTF-8">
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Helvetica', 'Arial', sans-serif;
              background-color: white;
            }
            .page {
              width: 210mm;
              height: 297mm;
              padding: 15mm;
              box-sizing: border-box;
              position: relative;
            }
            .ticket-container {
              width: 180mm;
              margin: 0 auto;
              border: 1px solid #ccc;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .ticket-header {
              background-color: #1a1a1a;
              color: white;
              padding: 15px;
              text-align: center;
              border-bottom: 1px solid #333;
            }
            .ticket-header h1 {
              margin: 0;
              font-size: 24px;
            }
            .ticket-header p {
              margin: 5px 0 0;
              font-size: 14px;
              opacity: 0.8;
            }
            .ticket-body {
              padding: 20px;
              background-color: white;
            }
            .ticket-info {
              margin-bottom: 20px;
            }
            .ticket-info h2 {
              margin: 0 0 15px;
              font-size: 18px;
              color: #333;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .info-row {
              display: flex;
              margin-bottom: 10px;
            }
            .info-label {
              font-weight: bold;
              width: 120px;
              color: #555;
            }
            .info-value {
              flex: 1;
            }
            .qr-section {
              display: flex;
              align-items: center;
              margin-top: 30px;
              position: relative;
              padding-left: 30px;
            }
            .cut-line {
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              border-left: 2px dashed #999;
            }
            .scissors-top {
              position: absolute;
              left: -10px;
              top: -10px;
              width: 20px;
              height: 20px;
              color: #666;
            }
            .scissors-bottom {
              position: absolute;
              left: -10px;
              bottom: -10px;
              width: 20px;
              height: 20px;
              color: #666;
            }
            .qr-code {
              width: 150px;
              height: 150px;
            }
            .qr-instructions {
              flex: 1;
              padding-left: 20px;
            }
            .qr-instructions p {
              margin: 0 0 10px;
              font-size: 14px;
              color: #555;
            }
            .qr-instructions h3 {
              margin: 0 0 10px;
              font-size: 16px;
              color: #333;
            }
            .ticket-footer {
              background-color: #f9f9f9;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #eee;
            }
            .ticket-footer p {
              margin: 0;
            }
            .event-logo {
              text-align: center;
              margin-bottom: 15px;
            }
            .event-logo h2 {
              font-size: 28px;
              margin: 0;
              color: #333;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="ticket-container">
              <div class="ticket-header">
                <h1>${vendedor?.event_name || "Evento"}</h1>
                <p>${eventDate}</p>
              </div>
              
              <div class="ticket-body">
                <div class="event-logo">
                  <h2>🎟️ TICKET OFICIAL 🎟️</h2>
                </div>
                
                <div class="ticket-info">
                  <h2>Información del Ticket</h2>
                  
                  <div class="info-row">
                    <div class="info-label">Nombre:</div>
                    <div class="info-value">${ticket.owner_name} ${ticket.owner_lastname}</div>
                  </div>
                  
                  ${
                    dniRequired && ticket.owner_dni
                      ? `
                  <div class="info-row">
                    <div class="info-label">DNI:</div>
                    <div class="info-value">${ticket.owner_dni}</div>
                  </div>
                  `
                      : ""
                  }
                  
                  <div class="info-row">
                    <div class="info-label">Tipo de Ticket:</div>
                    <div class="info-value">${ticket.ticket_tag.name}</div>
                  </div>
                  
                  <div class="info-row">
                    <div class="info-label">Fecha de Emisión:</div>
                    <div class="info-value">${ticketDate}</div>
                  </div>
                  
                  <div class="info-row">
                    <div class="info-label">ID de Ticket:</div>
                    <div class="info-value">${ticket.uuid}</div>
                  </div>
                </div>
                
                <div class="qr-section">
                  <div class="cut-line"></div>
                  <svg class="scissors-top" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9Z" />
                    <path d="M6 15C6 13.3431 7.34315 12 9 12C10.6569 12 12 13.3431 12 15C12 16.6569 10.6569 18 9 18C7.34315 18 6 16.6569 6 15Z" />
                    <path d="M12 9L19 4" />
                    <path d="M12 15L19 20" />
                  </svg>
                  <svg class="scissors-bottom" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9Z" />
                    <path d="M6 15C6 13.3431 7.34315 12 9 12C10.6569 12 12 13.3431 12 15C12 16.6569 10.6569 18 9 18C7.34315 18 6 16.6569 6 15Z" />
                    <path d="M12 9L19 4" />
                    <path d="M12 15L19 20" />
                  </svg>
                  
                  <img src="${qrImageUrl}" alt="Código QR del ticket" class="qr-code" />
                  
                  <div class="qr-instructions">
                    <h3>Instrucciones:</h3>
                    <p>1. Recorta el código QR por la línea punteada</p>
                    <p>2. Presenta este código en la entrada del evento</p>
                    <p>3. Conserva este ticket como comprobante</p>
                  </div>
                </div>
              </div>
              
              <div class="ticket-footer">
                <p>Este ticket es personal e intransferible. La organización se reserva el derecho de admisión.</p>
                <p>Para cualquier consulta, contacta con el organizador del evento.</p>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vista previa de impresión</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white text-black p-4 rounded-md">
            <div className="bg-gray-900 text-white p-4 rounded-t-md">
              <h2 className="text-xl font-bold text-center">{vendedor?.event_name || "Evento"}</h2>
              <p className="text-center text-sm opacity-80">Ticket oficial</p>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-bold border-b border-gray-200 pb-1 mb-2">Información del Ticket</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-semibold">Nombre:</div>
                  <div className="col-span-2">
                    {ticket.owner_name} {ticket.owner_lastname}
                  </div>

                  {dniRequired && ticket.owner_dni && (
                    <>
                      <div className="font-semibold">DNI:</div>
                      <div className="col-span-2">{ticket.owner_dni}</div>
                    </>
                  )}

                  <div className="font-semibold">Tipo:</div>
                  <div className="col-span-2">{ticket.ticket_tag.name}</div>

                  <div className="font-semibold">Fecha:</div>
                  <div className="col-span-2">{formatDate(new Date(ticket.created_at))}</div>
                </div>
              </div>

              <div className="flex items-center mt-6 relative">
                <div className="border-l-2 border-dashed border-gray-400 h-full absolute left-0 top-0"></div>
                <div className="absolute -left-3 -top-3">
                  <Scissors className="h-6 w-6 text-gray-500" />
                </div>
                <div className="absolute -left-3 -bottom-3">
                  <Scissors className="h-6 w-6 text-gray-500" />
                </div>

                <div className="pl-8 flex items-center gap-4">
                  {qrImageUrl && <img src={qrImageUrl || "/placeholder.svg"} alt="QR Code" className="w-24 h-24" />}

                  <div className="text-sm">
                    <h4 className="font-bold mb-1">Instrucciones:</h4>
                    <p>1. Recorta el código QR por la línea punteada</p>
                    <p>2. Presenta este código en la entrada</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-3 text-center text-xs text-gray-500 rounded-b-md">
              <p>Este ticket es personal e intransferible.</p>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="bg-gray-700 text-white hover:bg-gray-600">
            Cancelar
          </Button>
          <Button onClick={handlePrint} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

TicketPrintPreview.propTypes = {
  ticket: PropTypes.object.isRequired,
  qrRef: PropTypes.object.isRequired,
  dniRequired: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  vendedor: PropTypes.object,
}
