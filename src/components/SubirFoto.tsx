import { useState } from 'react';
import {
  Button,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Alert,
  Stack,
  TextField,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { subirFoto } from '../services/api';

interface SubirFotoProps {
  entidadTipo: 'accesion' | 'enfermedad' | 'producto' | 'noticia';
  entidadId: number;
  onSubida?: (url: string) => void;
}

const SubirFoto = ({ entidadTipo, entidadId, onSubida }: SubirFotoProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [preview, setPreview] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setExito('');
    setError('');
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    setSubiendo(true);
    setError('');
    setExito('');
    try {
      const res = await subirFoto(file, entidadTipo, entidadId, descripcion || undefined);
      setExito(`Foto subida: ${res.url}`);
      setFile(null);
      setPreview('');
      onSubida?.(res.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Subir Foto
      </Typography>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} size="small">
          Seleccionar
          <input
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
          />
        </Button>

        {file && (
          <Button variant="contained" size="small" onClick={handleUpload} disabled={subiendo}>
            {subiendo ? 'Subiendo...' : 'Subir'}
          </Button>
        )}

        <Typography variant="caption" color="text.secondary">
          {file
            ? `${file.name} (${(file.size / 1024).toFixed(0)}KB)`
            : 'JPG, PNG, WebP, GIF — max 10MB'}
        </Typography>
      </Stack>

      {file && (
        <TextField
          label="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          size="small"
          fullWidth
          sx={{ mt: 1 }}
        />
      )}

      {subiendo && <LinearProgress sx={{ mt: 1 }} />}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      {exito && (
        <Alert severity="success" sx={{ mt: 1 }}>
          {exito}
        </Alert>
      )}

      {preview && (
        <Box sx={{ mt: 1, maxWidth: 200 }}>
          <img src={preview} alt="preview" style={{ width: '100%', borderRadius: 8 }} />
        </Box>
      )}
    </Paper>
  );
};

export default SubirFoto;
