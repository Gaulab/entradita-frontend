import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
// Custom components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, AlertTriangle, Calendar, MapPin } from "lucide-react";
// API
import { getTicket } from '../api/ticketApi';

export default function TicketPage() {
    const { ticket_uuid } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (ticket_uuid) {
            const getData = async () => {
                try {
                    const data = await getTicket(ticket_uuid);
                    setData(data);
                    setLoading(false);  
                } catch (error) {
                    setError(error.message);
                }
            };
            getData();
        } else {
            setError('No se proporcionó un UUID válido');
        }
    }, [ticket_uuid]);

    const handleDownload = () => {
        const svg = document.getElementById('qr-code');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            // Increase the size of the canvas for better resolution
            const scale = 4;
            const borderSize = 20; // Size of the white border
            canvas.width = (img.width + borderSize * 2) * scale;
            canvas.height = (img.height + borderSize * 2) * scale;
            ctx.scale(scale, scale);
            ctx.fillStyle = 'white'; // Set the border color to white
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw the white border
            ctx.drawImage(img, borderSize, borderSize);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `ticket-qr-${ticket_uuid}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-900 w-screen"><div className="text-white">Cargando...</div></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen bg-gray-900"><div className="text-red-500">Error: {error}</div></div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-xl overflow-hidden relative">
                <CardHeader className="relative pb-0 pt-2 px-2">
                    <div className="flex flex-col items-center mb-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 mr-4">
                            <img 
                                src={data.event_image_address} 
                                alt="Event Logo" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">{data.event_name}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-4 px-6">
                    <div className="flex justify-center bg-white p-1 rounded-lg shadow-inner">
                        <QRCodeSVG
                            id="qr-code"
                            value={data.qr_payload}
                            size={300}
                            level="H"
                        />
                    </div>
                    <div className="text-center text-gray-300 space-y-2">
                        <p className="text-lg font-semibold">{data.owner_name} {data.owner_lastname}</p>
                        <p className="text-sm">DNI: {data.owner_dni}</p>
                    </div>
                    <div className="flex flex-col space-y-2 text-gray-400 text-sm">
                        <div className="flex items-center justify-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{data.event_date}</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            <span>{data.event_place}</span>
                        </div>
                    </div>
                    <Alert variant="destructive" className="bg-red-900 border-red-700">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                            No compartas esta entrada con nadie. Es única y personal. <br /> Podes presentarte en la entrada del evento con esta misma página web o podes descargar el codigo QR por si no tenes internet.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter className="flex flex-col items-center pt-2 pb-6 space-y-4">
                    <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 transition-colors">
                        <Download className="mr-2 h-4 w-4" /> Descargar QR
                    </Button>
                    <div className="text-gray-500 text-sm">
                        entradita.com
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}