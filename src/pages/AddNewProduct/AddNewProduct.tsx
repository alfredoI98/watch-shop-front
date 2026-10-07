
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from '../../api';
import { Navbar } from '../../components/Navbar/Navbar';
import './AddNewProduct.css';

interface WatchForm {
  name: string;
  brand: string;
  description: string;
  price: string;
  category: string;
  movementType: string;
  waterResistance: string;
  imagePath: string;
}

const initialForm: WatchForm = {
  name: '',
  brand: '',
  description: '',
  price: '',
  category: '',
  movementType: '',
  waterResistance: '',
  imagePath: '',
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1200;

const compressImage = async (file: File): Promise<string> => {
  const image = await createImageBitmap(file);

  try {
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('No se pudo preparar la imagen para comprimirla.');
    }

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const compressedImage = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('No se pudo comprimir la imagen.')),
        'image/jpeg',
        0.78,
      );
    });

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('No se pudo codificar la imagen.'));
        }
      };
      reader.onerror = () => reject(new Error('No se pudo leer la imagen comprimida.'));
      reader.readAsDataURL(compressedImage);
    });
  } finally {
    image.close();
  }
};

export const AddNewProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageFileName, setImageFileName] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value.trim() }));
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = event.target.value.replace(/\D/g, '');
    setForm((currentForm) => ({ ...currentForm, price }));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona un archivo de imagen válido.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('La imagen debe pesar menos de 10 MB.');
      return;
    }

    setIsProcessingImage(true);
    setImageFileName('');
    setForm((currentForm) => ({ ...currentForm, imagePath: '' }));

    try {
      const compressedImage = await compressImage(file);
      setForm((currentForm) => ({ ...currentForm, imagePath: compressedImage }));
      setImageFileName(file.name);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo procesar la imagen.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isProcessingImage) return;
    if (!form.imagePath) {
      toast.error('Selecciona una imagen para el reloj.');
      return;
    }
    setIsSubmitting(true);

    try {
      await api.post('/watches', {
        ...form,
        price: Number(form.price),
      });
      toast.success('El reloj se agregó al catálogo.');
      navigate('/');
    } catch (error) {
      const responseMessage = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      const message = Array.isArray(responseMessage)
        ? responseMessage.join(' ')
        : typeof responseMessage === 'string'
          ? responseMessage
          : 'No se pudo agregar el reloj. Intenta nuevamente.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="add-watch-page">
        <section className="add-watch-card" aria-labelledby="add-watch-title">
          <header className="add-watch-header">
            <p className="add-watch-eyebrow">CATÁLOGO</p>
            <h1 id="add-watch-title">Añadir un reloj</h1>
            <p>Completa los detalles para incorporar una nueva pieza a la colección.</p>
          </header>

          <form className="add-watch-form" onSubmit={handleSubmit}>
            <div className="add-watch-fields">
              <label className="add-watch-field">
                <span>Nombre</span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Ej. Submariner Date" required />
              </label>

              <label className="add-watch-field">
                <span>Marca</span>
                <input name="brand" value={form.brand} onChange={handleChange} placeholder="Ej. Rolex" required />
              </label>

              <label className="add-watch-field add-watch-field--full">
                <span>Descripción</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe los detalles y características del reloj"
                  rows={4}
                  required
                />
              </label>

              <label className="add-watch-field">
                <span>Precio</span>
                <input
                  name="price"
                  type="text"
                  inputMode="numeric"
                  value={form.price}
                  onChange={handlePriceChange}
                  placeholder="Ej. 1500"
                  pattern="[1-9][0-9]*"
                  title="Ingresa un precio entero positivo, sin decimales."
                  required
                />
              </label>

              <label className="add-watch-field">
                <span>Categoría</span>
                <input name="category" value={form.category} onChange={handleChange} placeholder="Ej. Deportivo" required />
              </label>

              <label className="add-watch-field">
                <span>Tipo de movimiento</span>
                <input
                  name="movementType"
                  value={form.movementType}
                  onChange={handleChange}
                  placeholder="Ej. Automático"
                  required
                />
              </label>

              <label className="add-watch-field">
                <span>Resistencia al agua</span>
                <input
                  name="waterResistance"
                  value={form.waterResistance}
                  onChange={handleChange}
                  placeholder="Ej. 100 m / 10 ATM"
                  required
                />
              </label>

              <label className="add-watch-field add-watch-field--full">
                <span>Imagen del reloj</span>
                <input
                  className="add-watch-file-input"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isProcessingImage}
                />
                <span className="add-watch-file-picker">
                  {isProcessingImage ? 'Procesando imagen…' : 'Seleccionar imagen'}
                </span>
                <small>
                  {isProcessingImage
                    ? 'Comprimiendo imagen…'
                    : imageFileName
                      ? `${imageFileName} · comprimida y lista para guardarse como texto Base64`
                      : 'Selecciona una imagen (máximo 10 MB). Se comprimirá y codificará para guardarse.'}
                </small>
              </label>
            </div>

            {form.imagePath && (
              <div className="add-watch-preview">
                <img src={form.imagePath} alt="Vista previa del reloj" />
              </div>
            )}

            <div className="add-watch-actions">
              <button className="add-watch-cancel" type="button" onClick={() => navigate('/')}>
                Cancelar
              </button>
              <button className="add-watch-submit" type="submit" disabled={isSubmitting || isProcessingImage}>
                {isProcessingImage ? 'Procesando imagen…' : isSubmitting ? 'Guardando…' : 'Añadir reloj'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};
