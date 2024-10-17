import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, AlertTriangle } from "lucide-react";
import AuthContext from '../context/AuthContext';

export default function TicketPage() {
    const { ticketId } = useParams();
    const { authToken } = useContext(AuthContext);
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Datos ficticios
    const mockData = {
        event: {
            image_address: 'https://via.placeholder.com/150',
        },
        qr_payload: 'mock-qr-code-payload',
        name: 'John',
        surname: 'Doe',
        dni: '12345678',
    };

    useEffect(() => {
        // Simula una carga de datos
        setTimeout(() => {
            setTicketData(mockData);
            setLoading(false);
        }, 1000);
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
                    <CardTitle className="text-2xl font-bold text-center text-white">Tu Entrada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <img 
                            src={ticketData.event.image_address} 
                            alt="Event" 
                            className="w-full max-w-xs rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="flex justify-center bg-white p-4 rounded-lg">
                        <QRCodeSVG
                            id="qr-code"
                            value={ticketData.qr_payload}
                            size={200}
                            level="H"
                        />
                    </div>
                    <div className="text-center text-gray-300">
                        <p>{ticketData.name} {ticketData.surname}</p>
                        <p>DNI: {ticketData.dni}</p>
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
