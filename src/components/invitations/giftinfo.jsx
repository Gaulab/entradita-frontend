"use client"

import { useState } from "react"
import { Copy } from "lucide-react"

function giftinfo() {
  // Replace with actual payment information
  const paymentInfo = {
    alias: "zoe.fiesta15",
    cbu: "0000003100007006496145",
    name: "Mariana Silva",
  }

  const [copied, setCopied] = useState(null)

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <div className="p-6">
        <p className="mb-6 text-center text-gray-600">
          Aquí están los datos
          para transferencias:
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Nombre</p>
                <p className="text-gray-600">
                  {paymentInfo.name.length > 15
                    ? `${paymentInfo.name.slice(0, 15)}...`
                    : paymentInfo.name}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Alias</p>
                <p className="text-gray-600">
                  {paymentInfo.alias.length > 15
                    ? `${paymentInfo.alias.slice(0, 15)}...`
                    : paymentInfo.alias}
                </p>
              </div>
              <button
                className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-green-300 px-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                onClick={() => copyToClipboard(paymentInfo.alias, "alias")}
              >
                {copied === "alias" ? "Copiado!" : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">CBU</p>
                <p className="text-gray-600">
                  {paymentInfo.cbu.length > 15
                    ? `${paymentInfo.cbu.slice(0, 15)}...`
                    : paymentInfo.cbu}
                </p>
              </div>
              <button
                className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-green-300 px-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                onClick={() => copyToClipboard(paymentInfo.cbu, "cbu")}
              >
                {copied === "cbu" ? "Copiado!" : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default giftinfo

