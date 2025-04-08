import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Tag, Percent, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import AuthContext from '../context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/loadingspinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF9F40', '#FF6633', '#FF5500'];

const EconomicReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [commissionAmount, setCommissionAmount] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { authToken } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(true);
  const [hasMounted, setHasMounted] = useState(false); // controlador bandera para evitar falso patch al cargar pagina

  useEffect(() => {
    const fetchEconomicReport = async () => {
      try {
        const token = typeof authToken === 'string' ? authToken.trim() : authToken.access.trim();
        const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/economic-report/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos.');
        }

        const result = await response.json();
        setData(result);
        setCommissionAmount(result.commission_per_ticket || 0);
        setHasMounted(true); // se ha montado el componente
        console.log(result);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchEconomicReport();
  }, [id, apiUrl, authToken]);

  useEffect(() => {
    if (!hasMounted) return; // no hacer nada si el componente no se ha montado
    const updateCommissionAmount = async () => {
      try {
        const token = typeof authToken === 'string' ? authToken.trim() : authToken.access.trim();
        const response = await fetch(`${apiUrl}/api/v1/main/event/${id}/economic-report/`, {
          method: 'PATCH', // o POST o PUT según tu backend
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ commission_per_ticket: commissionAmount }),
        });
  
        if (!response.ok) {
          throw new Error('Error al actualizar la comisión.');
        }
  
        const result = await response.json();
        console.log('Comisión actualizada', result);
      } catch (error) {
        console.error(error.message);
      }
    };
  
    if (data) {
      updateCommissionAmount();
    }
  }, [commissionAmount]);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const totalCommission = useMemo(() => {
    if (!data) return 0;
    return data.sellers.reduce((total, seller) => {
      const ticketsSold = seller.ticket_counter || 0;
      return total + ticketsSold * commissionAmount;
    }, 0);
  }, [data, commissionAmount]);

  const netRevenue = useMemo(() => {
    if (!data || typeof data.total_sales !== 'number') return 0;
    return data.total_sales - totalCommission;
  }, [data, totalCommission]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.ticket_tags.map((tag) => {
      const quantitySold = data.sellers.reduce((total, seller) => total + (seller.ticket_tag_sales[tag.id] || 0), 0);
      return {
        name: tag.name,
        value: quantitySold * tag.price,
      };
    });
  }, [data]);

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 bg-gray-900 text-gray-100 min-h-screen justify-center w-screen">
      <div className="max-w-6xl space-y-4 mx-auto w-full">
        {showAlert && (
          <Alert className="mb-4 bg-yellow-900 border-yellow-700">
            <AlertDescription>Para que este reporte funcione correctamente, asegúrese de haber configurado los precios adecuados para los ticket tags en el evento.</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center mb-4 gap-4">
        <Button variant="entraditaTertiary" onClick={() => navigate(-1)} className="mb-0 flex items-center max-md:w-full w-72">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-0">Reporte Económico</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recaudación Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${data.total_sales.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
              <Tag className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{data.total_tickets}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comisión Total</CardTitle>
              <Percent className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">${isNaN(totalCommission) ? '0.00' : totalCommission.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingreso Neto</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">${isNaN(netRevenue) ? '0.00' : netRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700 rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Desglose por Vendedor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Label htmlFor="commissionAmount" className="whitespace-nowrap">
                Comisión por Ticket ($)
              </Label>
              <Input
                id="commissionAmount"
                type="number"
                value={commissionAmount}
                onChange={(e) => setCommissionAmount(Number(e.target.value))}
                className="max-w-xs bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-center">
                    <TableHead className="text-gray-300">Vendedor</TableHead>
                    <TableHead className="text-gray-300">Tickets Vendidos</TableHead>
                    <TableHead className="text-gray-300 max-sm:hidden ">Desglose de Ventas</TableHead>
                    <TableHead className="text-gray-300">Total Vendido</TableHead>
                    <TableHead className="text-gray-300">Comisión a Pagar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-center">
                  {data.sellers.map((seller) => {
                    const sellerTotal = Object.entries(seller.ticket_tag_sales).reduce((total, [tagId, quantity]) => {
                      const tag = data.ticket_tags.find((t) => t.id === parseInt(tagId));
                      return total + (tag ? tag.price * quantity : 0);
                    }, 0);
                    const sellerCommission = (seller.ticket_counter || 0) * commissionAmount;
                    return (
                      <TableRow key={seller.id}>
                        <TableCell className="font-medium">{seller.assigned_name}</TableCell>
                        <TableCell>{seller.ticket_counter}</TableCell>
                        <TableCell className="max-sm:hidden">
                          {Object.entries(seller.ticket_tag_sales)
                            .map(([tagId, quantity]) => {
                              const tag = data.ticket_tags.find((t) => t.id === parseInt(tagId));
                              return tag ? `${tag.name}: ${quantity}` : null;
                            })
                            .filter(Boolean)
                            .join(', ')}
                        </TableCell>
                        <TableCell>${sellerTotal.toFixed(2)}</TableCell>
                        <TableCell className="font-bold">${sellerCommission.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Desglose por Tipo de Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-between">
              <div className="w-full md:w-1/2 h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie  data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '0.375rem' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full  overflow-x-auto mt-4 md:mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300 text-left">Tipo de Ticket</TableHead>
                      <TableHead className="text-gray-300 text-left">Precio</TableHead>
                      <TableHead className="text-gray-300 text-left">Cantidad</TableHead>
                      <TableHead className="text-gray-300 text-left">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.ticket_tags.map((tag) => {
                      const quantitySold = data.sellers.reduce((total, seller) => total + (seller.ticket_tag_sales[tag.id] || 0), 0);
                      return (
                        <TableRow key={tag.id}>
                          <TableCell className="font-medium">{tag.name}</TableCell>
                          <TableCell>${tag.price.toFixed(2)}</TableCell>
                          <TableCell>{quantitySold}</TableCell>
                          <TableCell className="font-bold">${(quantitySold * tag.price).toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EconomicReport;
