import { useEffect, useState } from 'react';
import 'axios';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import { InputAdornment, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { setFieldValue } from './utils';
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from '@mui/system';
import { useUserContext } from './hooks/UserContext';
import { PasswordTextField } from './Pages/Login/PasswordTextField';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [message, setMessage] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  useEffect(() => {
    if(state?.message) {
      setMessage(state.message);
    }
    const existingToken = localStorage.getItem('token');
    if(!existingToken) return;

    axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
    navigate('/home');
  }, []);

  async function handleIngresarClick(event) {
    event.preventDefault();
    setMessage('');
    try {
      setWaiting(true);
      const { data } = await axios.post('/api/login', {
        email,
        password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('nombre', data.nombre);
      setUser(data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      navigate('/home');
    } catch (error) {
      setMessage(error.response.data.message);
    } finally {
      setWaiting(false);
    }
  }

  return (
    <div style={{
      backgroundImage: 'linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
      }}>
        <div style={{
          display: 'flex',
          marginBottom: 'auto',
          justifyContent: 'flex-end',
          width: '100%'
        }}>
          <Typography sx={{ fontSize: 14, color: 'white' }}>
            UADE - Integración de Aplicaciones - Grupo 1
          </Typography>
        </div>
        <Card elevation={6} sx={{marginTop: 'auto'}}>
          <CardContent>
            <Stack spacing={2}>
              <Typography sx={{ fontSize: 14 }}>
                Sistema de Administración de Contenido
              </Typography>
              <Typography sx={{ fontSize: 22 }}>
                Ingresar
              </Typography>
              <Box
                component="form"
                noValidate
                autoComplete="off"
              >
                <Stack spacing={2}>
                  <TextField
                    disabled={waiting}
                    autoFocus
                    label="Usuario"
                    variant="outlined"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">@uade.edu.ar</InputAdornment>,
                    }}
                    onChange={setFieldValue(setEmail)}
                  />
                  <PasswordTextField
                    disabled={waiting}
                    label="Contraseña"
                    variant="outlined"
                    onChange={setFieldValue(setPassword)}
                  />
                  <LoadingButton
                    loading={waiting}
                    startIcon={<LoginIcon />}
                    size='large'
                    variant='contained'
                    type="submit"
                    onClick={handleIngresarClick}
                  >
                    Ingresar
                  </LoadingButton>
                </Stack>
              </Box>
              {message !== '' && (
                <Typography sx={{ color: 'error.main' }}>{message}</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
        {/* Invisible box to center Card */}
        <Box sx={{marginTop: 'auto', marginBottom: 'auto'}}></Box>
      </div>
    </div>
  );
}

export default App;
