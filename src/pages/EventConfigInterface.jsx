// entradiatFront/src/pages/EventConfigInterface.jsx
// React import
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
// Custom components
import { LogOutIcon, PlusIcon, Eye, HelpCircle, Text, BoxIcon, ShoppingBasket, Map, ArrowUp, ArrowDown, Trash2, Save, ExternalLink, Copy, ArrowBigLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '../components/ui/label';
// APIs
import { getEventPage } from '../api/eventPageApi';
// Context auth
import AuthContext from '../context/AuthContext';

const blockTypes = [
  { id: 'title', name: 'Título', icon: Text },
  { id: 'text', name: 'Texto', icon: Text },
  { id: 'image_front', name: 'Imagen frontal', icon: Eye },
  { id: 'countdown', name: 'Cuenta regresiva', icon: BoxIcon },
  { id: 'button', name: 'Botón de compra', icon: ShoppingBasket },
  { id: 'button_whatsapp', name: 'Botón de WhatsApp', icon: ShoppingBasket },
  { id: 'map', name: 'Mapa', icon: Map },
  { id: 'cbu_alias', name: 'CBU/Alias', icon: Text },
];

export default function EventConfigInterface() {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const [blocks, setBlocks] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const fetchEventPage = async () => {
      try {
        const eventPage = await getEventPage(id, authToken.access);
        setEventData(eventPage);
        console.log("eventPage", eventPage);
        
        const orderedBlocks = eventPage.block_order.map((blockType) => {
          let content = '';
          let settings = {};
          
          switch(blockType) {
            case 'title':
              content = eventPage.title || '';
              break;
            case 'text':
              content = eventPage.text || '';
              break;
            case 'image_front':
              content = eventPage.image_front || '';
              break;
            case 'countdown':
              content = eventPage.contdown_date || '';
              break;
            case 'button':
              content = eventPage.button_text || '';
              settings = { link: eventPage.button_link || '' };
              break;
            case 'button_whatsapp':
              content = eventPage.button_whatsapp || '';
              break;
            case 'map':
              content = eventPage.map_address || '';
              break;
            case 'cbu_alias':
              content = eventPage.text_buy || '';
              settings = { cbu: eventPage.cbu || '', alias: eventPage.alias || '' };
              break;
          }

          return {
            id: `block-${blockType}-${Date.now()}`,
            type: blockType,
            content,
            settings,
          };
        });
  
        setBlocks(orderedBlocks);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEventPage();
  }, [id, authToken]);

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [blocks, eventData]);

  const addBlock = (type) => {
    if (blocks.some(block => block.type === type)) {
      alert('Este tipo de bloque ya ha sido agregado.');
      return;
    }
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      settings: {},
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(index, 1);
    newBlocks.splice(index + direction, 0, removed);
    setBlocks(newBlocks);
    console.log("newBlocks", newBlocks);
  };

  const renderBlockConfig = (block) => {
    switch (block.type) {
      case 'title':
      case 'text':
        return <Input value={block.content} onChange={(e) => updateBlock(block.id, { content: e.target.value })} placeholder={`Ingrese el ${block.type === 'title' ? 'título' : 'texto'}`} />;
      case 'image_front':
        return <Input value={block.content} onChange={(e) => updateBlock(block.id, { content: e.target.value })} placeholder="URL de la imagen frontal" />;
      case 'countdown':
        return <Input type="datetime-local" value={block.content || ''} onChange={(e) => updateBlock(block.id, { content: e.target.value })} />;
      case 'button':
        return (
          <div className="space-y-2">
            <Input value={block.content} onChange={(e) => updateBlock(block.id, { content: e.target.value })} placeholder="Texto del botón" />
            <Input value={block.settings.link || ''} onChange={(e) => updateBlock(block.id, { settings: { ...block.settings, link: e.target.value } })} placeholder="URL de compra" />
          </div>
        );
      case 'button_whatsapp':
        return <Input value={block.content} onChange={(e) => updateBlock(block.id, { content: e.target.value })} placeholder="Número de WhatsApp" />;
      case 'map':
        return <Input value={block.content} onChange={(e) => updateBlock(block.id, { content: e.target.value })} placeholder="URL de Google Maps" />;
      case 'cbu_alias':
        return (
          <div className="space-y-2">
            <Input value={block.settings.cbu || ''} onChange={(e) => updateBlock(block.id, { settings: { ...block.settings, cbu: e.target.value } })} placeholder="CBU" />
            <Input value={block.settings.alias || ''} onChange={(e) => updateBlock(block.id, { settings: { ...block.settings, alias: e.target.value } })} placeholder="Alias" />
            <Textarea value={block.content} onChange={(e) => updateBlock(block.id, { content: e.target.value })} placeholder="Instrucciones de compra" />
          </div>
        );
      default:
        return null;
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedEventData = {
        ...eventData,
        block_order: blocks.map(block => block.type),
      };
      blocks.forEach(block => {
        switch(block.type) {
          case 'title':
            updatedEventData.title = block.content;
            break;
          case 'text':
            updatedEventData.text = block.content;
            break;
          case 'image_front':
            updatedEventData.image_front = block.content;
            break;
          case 'countdown':
            updatedEventData.contdown_date = block.content;
            break;
          case 'button':
            updatedEventData.button_text = block.content;
            updatedEventData.button_link = block.settings.link;
            break;
          case 'button_whatsapp':
            updatedEventData.button_whatsapp = block.content;
            break;
          case 'map':
            updatedEventData.map_address = block.content;
            break;
          case 'cbu_alias':
            updatedEventData.text_buy = block.content;
            updatedEventData.cbu = block.settings.cbu;
            updatedEventData.alias = block.settings.alias;
            break;
        }
      });
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
    window.open(`https://entradita.com/eventPage/${id}`, '_blank');
  };

  const handleCopyEventLink = () => {
    const eventLink = `https://entradita.com/eventPage/${id}`;
    navigator.clipboard.writeText(eventLink).then(() => {
      alert('Link del evento copiado al portapapeles');
    });
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
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen w-screen p-4 bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-2">
          <h1 className="text-3xl font-bold">Event page settings</h1>
        </div>

        <div className="flex max-sm:flex-col mb-2 justify-between items-center">
          <div className="flex flex-row max-sm:mb-2 sm:mr-2 space-x-2 w-full">
            <Button className="w-full" variant="entraditaTertiary" onClick={handleGoBack}>
              <ArrowBigLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
            <Button onClick={handleSaveChanges} variant="entraditaTertiary" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Guardar cambios
            </Button>
          </div>

          <div className="flex flex-row space-x-2 w-full">
            <Button className="w-full" variant="entraditaTertiary">
              <HelpCircle className="mr-2 h-4 w-4" /> Como funciona?
            </Button>
            <Button onClick={handleGoToEventPage} variant="entraditaTertiary" className="w-full">
              <ExternalLink className="mr-2 h-4 " /> Página
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader>
            <CardTitle className="text-white">Principales</CardTitle>
            <CardDescription className="text-gray-400">Características principales de la página</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2 ">
              <Label htmlFor="image_address" className="text-gray-200">
                Imagen de fondo
              </Label>
              <Input label="background image" placeholder="URL"
                id="image_address" name="image_address"
                value={eventData?.image_background}
                maxLength={500}
                onChange={(e) => setBackgroundImage(e.target.value)}
                required className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="font_address" className="text-gray-200">
                Fuente
              </Label>
              <Select 
                onValueChange={(value) => setEventData({...eventData, font_address: value})} 
                defaultValue={eventData.font_address}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full p-2 rounded" id="font_address" name="font_address">
                  <SelectValue placeholder="Selecciona una fuente" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700">
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Palatino">Palatino</SelectItem>
                  <SelectItem value="Garamond">Garamond</SelectItem>
                  <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                  <SelectItem value="Arial Black">Arial Black</SelectItem>
                  <SelectItem value="Tahoma">Tahoma</SelectItem>
                  <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                  <SelectItem value="Impact">Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="font_color" className="text-gray-200">
                Color de fuente
              </Label>
              <Input
                type="color"
                id="font_color"
                name="font_color"
                value={eventData.font_color}
                onChange={(e) => setEventData({...eventData, font_color: e.target.value})}
                className="h-10 px-2 bg-gray-700 border-gray-600 text-white"
              />
            </div>

          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Bloques</CardTitle>
            <CardDescription className="text-gray-400">Administra los bloques de tu página</CardDescription>
          </CardHeader>
          <CardContent >
            <Dialog >
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white mb-4">
                  <PlusIcon className="mr-1 h-4 w-4" />
                  Nuevo bloque
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800  border-gray-700">
                <DialogHeader >
                  <DialogTitle className="text-white">Seleccionar bloque</DialogTitle>
                  <DialogDescription className="text-gray-400">Selecciona el bloque que deseas agregar</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-2 text-start justify-start">
                  {blockTypes.map((type) => (
                    <DialogTrigger asChild key={type.id}>
                      <Button onClick={() => addBlock(type.id)}>
                        <type.icon className="mr-2 h-4 w-4" /> {type.name}
                      </Button>
                    </DialogTrigger>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <Card key={block.id} className="bg-gray-700 border-gray-600">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-white text-sm">{blockTypes.find((t) => t.id === block.type)?.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button className="px-4 py-2" variant="ghost" onClick={() => moveBlock(index, -1)} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button className="px-4 py-2" variant="ghost" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button className="px-4 py-2" variant="ghost" onClick={() => removeBlock(block.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>{renderBlockConfig(block)}</CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
