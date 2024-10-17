import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, AlertTriangle } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function TicketPage() {
    const { ticketToken } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const eventName = jwtDecode(ticketToken).event;

    useEffect(() => {
        const getdata = async () => {
            const response = await fetch(`http://localhost:8000/api/v1/tickets/${ticketToken}`, {
                headers: {
                    'Authorization': `Bearer ${ticketToken}`
                }
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                setData(data);
                setLoading(false);
            } else {
                setError('QR inexistente');
            }
        }
        getdata();
    }, []);

    const handleDownload = () => {
        const svg = document.getElementById('qr-code');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `ticket-${ticketId}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

    if (loading) return <div className="text-center text-white">Cargando...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-white">Tu Entrada para {eventName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* <div className="flex justify-center">
                        <img 
                            src={data.event.image_address} 
                            alt="Event" 
                            className="w-full max-w-xs rounded-lg shadow-lg"
                        />
                    </div> */}
                    <div className="flex justify-center bg-white p-4 rounded-lg">
                        <QRCodeSVG
                            id="qr-code"
                            value={data.qr_payload}
                            size={200}
                            level="H"
                        />
                    </div>
                    <div className="text-center text-gray-300">
                        <p>{data.name} {data.surname}</p>
                        <p>DNI: {data.dni}</p>
                    </div>
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            No compartas esta entrada con nadie. Es única y personal.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="mr-2 h-4 w-4" /> Descargar Entrada
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
