import { errorToObject } from '@/utils';
import { LoginForm, userAPI } from '@features/Users';
import { useUserContext } from '@hooks/UserContext';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from "react-router-dom";

const styles = {
  backgroundDiv: {
    backgroundImage: 'linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
  },
  containerDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
  },
  firstRowDiv: {
    display: 'flex',
    marginBottom: 'auto',
    justifyContent: 'flex-end',
    width: '100%'
  },
  bottomBox: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
}

export function Login() {

  const [waiting, setWaiting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  useEffect(() => {
    const awaitVerifyToken = async () => {
      try {
        await userAPI.verifyToken();
        navigate('/home');
      } catch (error) {
        // Stays in this page for logging in
      }
    }
    if(state?.message) {
      setMessage(state.message);
    }
    awaitVerifyToken();
  }, []);

  async function handleIngresar({ email, password }) {
    setMessage('');
    try {
      setWaiting(true);
      const data = await userAPI.login({ email, password });
      setUser(data);
      navigate('/home');
    } catch (error) {
      const errors = errorToObject(error);
      setMessage(errors.message);
      setErrors(errors.fields);
    } finally {
      setWaiting(false);
    }
  }

  return (
    <div style={styles.backgroundDiv}>
      <Helmet>
        <meta name="theme-color" content="rgb(2, 0, 36)" />
      </Helmet>
      <div style={styles.containerDiv}>
        <div style={styles.firstRowDiv}>
          <Typography sx={{ fontSize: 14, color: 'white' }}>
            UADE - Integración de Aplicaciones - Grupo 4
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
              <LoginForm
                disabled={waiting}
                errors={errors}
                onSubmit={handleIngresar}
              />
              {message !== '' && (
                <Typography sx={{ color: 'error.main' }}>{message}</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
        {/* Invisible box to center Card */}
        <Box sx={styles.bottomBox}></Box>
      </div>
    </div>
  );
}
