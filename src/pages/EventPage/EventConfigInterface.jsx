import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusIcon, HelpCircle, Text, BoxIcon, ShoppingBasket, ArrowUp, ArrowDown, Trash2, Save, ExternalLink, ArrowBigLeft, Image, HourglassIcon, CreditCard, Music, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getEventPage, updateEventPage } from '@/api/eventPageApi';
import AuthContext from '@/context/AuthContext';
import { googleFonts, FontStyles } from '../../fonts';
import LoadingSpinner from '@/components/ui/loadingspinner';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { FaSpotify, FaPiggyBank } from 'react-icons/fa';
import { SiMercadopago } from 'react-icons/si';
import { IoMdRadioButtonOn } from 'react-icons/io';
import { MdOutlineTitle } from 'react-icons/md';
const blockTypes = [
  { id: 'GENERAL', name: 'General', icon: BoxIcon },
  { id: 'TITLE', name: 'TÍTULO', icon: MdOutlineTitle },
  { id: 'TEXT', name: 'TEXTO', icon: Text },
  { id: 'IMAGE', name: 'IMAGEN', icon: Image },
  { id: 'COUNTDOWN', name: 'CUENTA REGRESIVA', icon: HourglassIcon },
  { id: 'BUTTON', name: 'BOTÓN', icon: IoMdRadioButtonOn },
  { id: 'PAY', name: 'INFO BANCARIA', icon: FaPiggyBank },
  // { id: 'MERCADOPAGO', name: 'MERCADO PAGO', icon: SiMercadopago },
  { id: 'SPOTIFY', name: 'SPOTIFY', icon: FaSpotify },
  { id: 'TARJETEROS', name: 'TARJETEROS', icon: Users },
];

export default function EventConfigInterface() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [blocks, setBlocks] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newSeller, setNewSeller] = useState({ name: '', lastName: '', phone: '' });
  
  useEffect(() => {
    const fetchEventPage = async () => {
      try {
        const eventPage = await getEventPage(id, authToken.access);
        setEventData(eventPage);
        setBlocks(eventPage.blocks);
        console.log('eventPage', eventPage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEventPage();
  }, [id, authToken]);

  useEffect(() => {
    if (eventData && JSON.stringify(blocks) !== JSON.stringify(eventData.blocks)) {
      setHasUnsavedChanges(true);
    }
    console.log('blocks', blocks);
  }, [blocks]);

  const addBlock = (type) => {
    const newBlock = {
      type,
      id: uuidv4(),
      order: blocks.length + 1,
      data: {},
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, updates) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(index, 1);
    newBlocks.splice(index + direction, 0, removed);
    newBlocks.forEach((block, index) => {
      block.order = index + 1;
    });
    setBlocks([...newBlocks]); // Force re-render by creating a new array
  };

  const renderBlockConfig = (block) => {
    switch (block.type) {
      case 'GENERAL':
        return (
          <div className="space-y-2">
            <div>
              <h3 className="text-md font-bold mb-1">Imagen de fondo</h3>
              <Input
                value={block.data.image_background || ''}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, image_background: e.target.value } })}
                placeholder="URL de la imagen de fondo"
              />
            </div>

            <div>
              <h3 className="text-md font-bold mb-1">Color de tarjetas</h3>
              <Input
                className="p-0 rounded-none"
                type="color"
                value={block.data.card_color || '#000000'}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, card_color: e.target.value } })}
              />
            </div>
            <div>
              <h3 className="text-md font-bold mb-1">Fuente</h3>
              <Select onValueChange={(value) => updateBlock(block.id, { data: { ...block.data, font: value } })} defaultValue={block.data.font}>
                <SelectTrigger className="bg-gray-700">
                  <SelectValue placeholder="Selecciona una fuente" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800">
                  {googleFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="text-md font-bold mb-1">Color de la letra</h3>
              <Input
                className="p-0 rounded-none"
                type="color"
                value={block.data.font_color || '#FFFFFF'}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, font_color: e.target.value } })}
              />
            </div>
          </div>
        );
      case 'TITLE':
        return (
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-bold mb-1">Titulo</h3>
              <Input value={block.data.title || ''} onChange={(e) => updateBlock(block.id, { data: { ...block.data, title: e.target.value } })} placeholder="Título" />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">Subtítulo</h3>
              <Input value={block.data.subtitle || ''} onChange={(e) => updateBlock(block.id, { data: { ...block.data, subtitle: e.target.value } })} placeholder="Subtítulo" />
            </div>
          </div>
        );
      case 'TEXT':
        return <Textarea value={block.data.text || ''} onChange={(e) => updateBlock(block.id, { data: { ...block.data, text: e.target.value } })} placeholder="Texto" />;
      case 'IMAGE':
        return <Input value={block.data.image_address || ''} onChange={(e) => updateBlock(block.id, { data: { ...block.data, image_address: e.target.value } })} placeholder="URL de la imagen" />;
      case 'COUNTDOWN':
        const formattedDate = block.data.contdown_date ? new Date(block.data.contdown_date).toISOString().slice(0, 16) : '';
        return <Input type="datetime-local" value={formattedDate} onChange={(e) => updateBlock(block.id, { data: { ...block.data, contdown_date: e.target.value } })} />;
      case 'BUTTON':
        return (
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-bold mb-1">Texto</h3>
              <Input value={block.data.button_text || ''} onChange={(e) => updateBlock(block.id, { data: { ...block.data, button_text: e.target.value } })} placeholder="Texto del botón" />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">Link</h3>
              <Input value={block.data.button_link || ''} onChange={(e) => updateBlock(block.id, { data: { ...block.data, button_link: e.target.value } })} placeholder="URL del botón" />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">Color de fondo</h3>
              <Input
                className="p-0 rounded-none"
                type="color"
                value={block.data.button_bgcolor || '#FFFFFF'}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, button_bgcolor: e.target.value } })}
              />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">Color de la letra</h3>
              <Input
                className="p-0 rounded-none"
                type="color"
                value={block.data.button_color || '#000000'}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, button_color: e.target.value } })}
              />
            </div>
          </div>
        );
      case 'PAY':
        return (
          <div className="space-y-2">
            <Input value={block.data.pay_text || ''} onChange={(e) => updateBlock(block.id, { data: { ...block.data, pay_text: e.target.value } })} placeholder="Texto de pago" />
            <Input value={block.data.pay_cbu || ''} onChange={(e) => updateBlock(block.id, { data: { ...block.data, pay_cbu: e.target.value } })} placeholder="CBU" />
            <Input value={block.data.pay_alias || ''} onChange={(e) => updateBlock(block.id, { data: { ...block.data, pay_alias: e.target.value } })} placeholder="Alias" />
          </div>
        );
      case 'MERCADOPAGO':
        return (
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-bold mb-1">Texto</h3>
              <Input
                value={block.data.button_text || ''}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, button_text: e.target.value } })}
                placeholder="Texto del botón de Mercado Pago"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">Color de fondo</h3>
              <Input
                className="p-0 rounded-none"
                type="color"
                value={block.data.button_bgcolor || '#FFFFFF'}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, button_bgcolor: e.target.value } })}
              />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">Color de la letra</h3>
              <Input
                className="p-0 rounded-none"
                type="color"
                value={block.data.button_color || '#000000'}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, button_color: e.target.value } })}
              />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">Configuración</h3>
              <Button variant="entraditaTertiary" onClick={() => navigate(`/event/${id}/purchase-config`)}>
                Configurar Mercado Pago
              </Button>
            </div>
          </div>
        );
      case 'SPOTIFY':
        return (
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-bold mb-1">Enlace de Spotify</h3>
              <Input
                value={block.data.spotify_link || ''}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, spotify_link: e.target.value } })}
                placeholder="Enlace de la playlist o track de Spotify"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">Texto (opcional)</h3>
              <Input
                value={block.data.text || ''}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, text: e.target.value } })}
                placeholder="Texto adicional (ej: '¿Hacemos la previa juntos?')"
              />
            </div>
          </div>
        );
      case 'TARJETEROS':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lista de Vendedores</h3>
            <div>
              <Label htmlFor="tarjeteros-text">Texto opcional</Label>
              <Input
                id="tarjeteros-text"
                value={block.data.text || ''}
                onChange={(e) => updateBlock(block.id, { data: { ...block.data, text: e.target.value } })}
                placeholder="Ej: Conseguí tus entradas con nuestros tarjeteros"
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-md font-semibold">Agregar nuevo vendedor:</h4>
              <Input
                value={newSeller.name}
                onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })}
                placeholder="Nombre o apodo"
                maxLength="26"
              />
              <Input
                value={newSeller.phone}
                onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
                placeholder="Número de teléfono"
                type="tel"
                maxLength="10"
              />
              <Button
                onClick={() => {
                  if (newSeller.name && newSeller.phone) {
                    const updatedSellers = block.data.sellers ? [...block.data.sellers, newSeller] : [newSeller];
                    updateBlock(block.id, { data: { ...block.data, sellers: updatedSellers } });
                    setNewSeller({ name: '', phone: '' });
                  }
                }}
              >
                Agregar Vendedor
              </Button>
            </div>
            {block.data.sellers && block.data.sellers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-md font-semibold">Vendedores agregados:</h4>
                {block.data.sellers.map((seller, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-600 px-2 py-2 rounded-md">
                    <span>{`${seller.name} - ${seller.phone}`}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedSellers = block.data.sellers.filter((_, i) => i !== index);
                        updateBlock(block.id, { data: { ...block.data, sellers: updatedSellers } });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

          </div>
        );
      default:
        return null;
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedBlocks = blocks.map((block) => {
        if (block.id.length === 36) {
          // UUID length is 36 characters
          const { id, ...rest } = block;
          return rest;
        }
        return block;
      });

      const updatedEventData = {
        ...eventData,
        blocks: updatedBlocks,
      };
      await updateEventPage(id, updatedEventData, authToken.access);
      setHasUnsavedChanges(false);
      alert('Cambios guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Error al guardar los cambios');
    }
  };

  const handleGoToEventPage = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Hay cambios sin guardar. ¿Desea guardarlos antes de salir?')) {
        handleSaveChanges();
      }
    }
    navigate(`/event-page/${id}`);
  };

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Hay cambios sin guardar. ¿Desea guardarlos antes de salir?')) {
        handleSaveChanges();
      }
    }
    navigate(-1);
  };

  if (!eventData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-screen p-4 bg-gray-900 text-gray-100">
      <FontStyles />
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-2">
          <h1 className="text-3xl font-bold">Event page settings</h1>
        </div>

        <div className="flex max-sm:flex-col mb-2 justify-between items-center">
          <div className="flex flex-row max-sm:mb-2 sm:mr-2 space-x-2 w-full">
            <Button className="w-full" variant="entraditaError" onClick={handleGoBack}>
              <ArrowBigLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
            <Button onClick={handleSaveChanges} variant="entraditaSuccess" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Guardar cambios
            </Button>
          </div>

          <div className="flex flex-row space-x-2 w-full">
            <Button to="/event-page-guide" className="w-full" variant="entraditaTertiary">
              <HelpCircle className="mr-2 h-4 w-4" /> Como funciona?
            </Button>
            <Button onClick={handleGoToEventPage} variant="entraditaTertiary" className="w-full">
              <ExternalLink className="mr-2 h-4 " /> Página
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader>
            <CardTitle className="text-white">Configuración General</CardTitle>
            <CardDescription className="text-gray-400">Ajustes generales de la página del evento</CardDescription>
          </CardHeader>
          <CardContent>{renderBlockConfig(blocks.find((block) => block.type === 'GENERAL'))}</CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Bloques</CardTitle>
            <CardDescription className="text-gray-400">Administra los bloques de tu página</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white mb-4">
                  <PlusIcon className="mr-1 h-4 w-4" />
                  Nuevo bloque
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Seleccionar bloque</DialogTitle>
                  <DialogDescription className="text-gray-400">Selecciona el bloque que deseas agregar</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-2 ">
                  {blockTypes
                    .filter((type) => type.id !== 'GENERAL')
                    .map((type) => (
                      <DialogTrigger asChild key={type.id}>
                        <Button variant="entraditaSecondary" className="w-full flex justify-start " onClick={() => addBlock(type.id)}>
                          <type.icon className="mr-2 h-4 w-4" /> {type.name}
                        </Button>
                      </DialogTrigger>
                    ))}
                </div>
              </DialogContent>
            </Dialog>
            <AnimatePresence>
              {blocks
                .filter((block) => block.type !== 'GENERAL')
                .map((block, index) => (
                  <motion.div key={block.id} layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.3 }}>
                    <Card className="bg-gray-700 border-gray-600 mb-4">
                      <CardHeader className="flex flex-col items-start justify-start pb-2">
                        <CardTitle className="text-white text-sm">{blockTypes.find((t) => t.id === block.type)?.name}</CardTitle>
                        <div className="flex space-x-2">
                          <Button className="px-4 py-2" variant="ghost" onClick={() => moveBlock(index + 1, -1)} disabled={index === 0}>
                            <ArrowUp className="h-5 w-5" />
                          </Button>
                          <Button className="px-4 py-2" variant="ghost" onClick={() => moveBlock(index + 1, 1)} disabled={index === blocks.filter((b) => b.type !== 'GENERAL').length - 1}>
                            <ArrowDown className="h-5 w-5" />
                          </Button>
                          <Button className="px-4 py-2" variant="entraditaError" onClick={() => removeBlock(block.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>{renderBlockConfig(block)}</CardContent>
                    </Card>
                  </motion.div>
                ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
