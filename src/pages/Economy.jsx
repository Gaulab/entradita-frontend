import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente principal de economía
const Economy = () => {
    const navigate = useNavigate(); // Usamos el hook para navegar

    // Estado para manejar el porcentaje o monto que recibe cada vendedor
    const [commission, setCommission] = useState(0);

    // Datos de ejemplo
    const ticketData = [
        { type: 'VIP', price: 150, count: 33, revenue: 5000 },
        { type: 'General', price: 100, count: 20, revenue: 10000 },
    ];

    const sellerData = [
        { seller: 'Juan', ticketsSold: 15, ticketDetails: { VIP: 8, General: 7 }, revenue: 2500 },
        { seller: 'Ana', ticketsSold: 38, ticketDetails: { VIP: 25, General: 13 }, revenue: 10000 },
    ];

    // Cálculo de las estadísticas
    const totalTicketsSold = ticketData.reduce((total, ticket) => total + ticket.count, 0);
    const totalRevenue = ticketData.reduce((total, ticket) => total + ticket.revenue, 0);

    // Calcular las ganancias y cuánto pagarle a cada vendedor
    const calculateSellerPayments = (seller) => {
        const totalSales = seller.ticketsSold * commission; // Ganancia total por las ventas del vendedor
        return totalSales;
    };

    // Calcular cuánto queda a ti después de pagarle al vendedor
    const calculateNetRevenue = (ticketPrice, ticketsSold, sellerPayment) => {
        const totalRevenue = ticketPrice * ticketsSold;
        return totalRevenue - sellerPayment;
    };

    // Calcular totales combinados
    const totalSellerPayments = sellerData.reduce((total, seller) => total + calculateSellerPayments(seller), 0);
    const totalNetRevenue = ticketData.reduce((total, ticket) => {
        const sellerPayments = sellerData.map(seller => calculateSellerPayments(seller));
        const netRevenue = sellerData.reduce((net, seller, i) => {
            return net + calculateNetRevenue(ticket.price, seller.ticketDetails[ticket.type], sellerPayments[i]);
        }, 0);
        return total + netRevenue;
    }, 0);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-6">
            <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-6">
                
                {/* Botón Volver Atrás */}
                <button
                    onClick={() => navigate(-1)} // Vuelve a la página anterior
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 mb-4"
                >
                    Volver Atrás
                </button>

                {/* Advertencia */}
                <div className="bg-yellow-500 text-black p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold">
                        ¡Advertencia! Para que esta página funcione correctamente, asegúrese de colocar el precio correcto a cada Ticket Tag.
                    </p>
                </div>

                {/* Información General y Economía de Tickets */}
                <h1 className="text-2xl font-semibold text-white mb-4">Información General y Economía de Tickets</h1>

                {/* Información de Ticket Tags y Economía */}
                <div className="space-y-4 mb-6">
                    {ticketData.map((ticket, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">{ticket.type}</h2>
                                    <p className="text-sm text-gray-400">Precio Individual: ${ticket.price}</p>
                                    <p className="text-sm text-gray-400">Tickets Vendidos: {ticket.count}</p>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold">Recaudado: ${ticket.revenue}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-md font-semibold">Total de Recaudación:</h3>
                                <p className="text-sm text-gray-400">Total por este tipo de ticket: ${ticket.revenue}</p>
                                <h3 className="text-md font-semibold">Ganancia Total para Vendedores:</h3>
                                <p className="text-sm text-gray-400">
                                    Total de ganancias para los vendedores: ${totalSellerPayments}
                                </p>
                                <h3 className="text-md font-semibold">Lo que queda para Ti:</h3>
                                <p className="text-sm text-gray-400">
                                    Total neto para ti después de pagar a los vendedores: ${totalNetRevenue}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Totales combinados */}
                    <div className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
                        <h3 className="text-lg font-semibold">Total General:</h3>
                        <p className="text-sm text-gray-400">Tickets vendidos en total: {totalTicketsSold}</p>
                        <p className="text-sm text-gray-400">Recaudación Total: ${totalRevenue}</p>
                        <p className="text-sm text-gray-400">
                            Total de ganancias para los vendedores: ${totalSellerPayments}
                        </p>
                        <p className="text-sm text-gray-400">Total neto para ti: ${totalNetRevenue}</p>
                    </div>
                </div>

                {/* Input para comisión de vendedor */}
                <div className="mb-4">
                    <label className="block text-white font-semibold mb-2">Comisión por Ticket Vendido:</label>
                    <input
                        type="number"
                        value={commission}
                        onChange={(e) => setCommission(parseFloat(e.target.value))}
                        className="w-full p-2 bg-gray-700 text-white rounded-lg"
                        placeholder="Ingrese el monto o porcentaje por ticket"
                    />
                </div>

                {/* Desglose por vendedor */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Desglose por Vendedores</h2>
                    {sellerData.map((seller, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md mb-4 text-white">
                            <h3 className="text-lg font-semibold">{seller.seller}</h3>
                            <p className="text-sm text-gray-400">Tickets vendidos: {seller.ticketsSold}</p>
                            <p className="text-sm text-gray-400">Recaudado: ${seller.revenue}</p>

                            {/* Mostrar ganancias del vendedor */}
                            <div className="mt-2">
                                <h4 className="text-md font-semibold">Ganancias:</h4>
                                <p className="text-sm text-gray-400">Total: ${calculateSellerPayments(seller)}</p>
                            </div>

                            <div className="mt-2">
                                <h4 className="text-md font-semibold">Detalles por tipo de ticket:</h4>
                                {Object.entries(seller.ticketDetails).map(([ticketType, count]) => (
                                    <div key={ticketType} className="text-sm text-gray-400">
                                        {ticketType}: {count} tickets
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Economy;
