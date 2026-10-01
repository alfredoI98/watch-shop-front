import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SpinnerLoading } from '../../components/SpinnerLoading/SpinnerLoading';
import { login, signup } from '../../services/auth';
import logo from '../../assets/rolex_logo.png';
import './Login.css';

export function Login() {

  const navigate = useNavigate();
  const [signState, setSignState] = useState('Sign In');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const user_auth = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (signState === 'Sign In') {
        await login(email, password, rememberMe);
        toast.success('Inicio de sesión correcto.');
      } else {
        await signup(name, email, password, age, gender, address, phone);
        toast.success('Cuenta creada correctamente.');
      }
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo completar la operación.');
    } finally {
      setLoading(false);
    }
  }

  return (
    loading ? <SpinnerLoading /> :
      <div className='login' style={ { height: signState === 'Sign Up' ? '100%' : '100vh' } }>
        <img src={logo} alt="Rolex" className="login-logo" />
        <div className="login-form">
          <h1>{signState}</h1>
          <form onSubmit={user_auth}>
            {signState === 'Sign Up' ?
              <>
                <input value={name} type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} />
                <input value={age} type="text" placeholder='Age' onChange={(e) => setAge(e.target.value)} />
                <input value={gender} type="text" placeholder='Gender' onChange={(e) => setGender(e.target.value)} />
                <input value={address} type="text" placeholder='Address' onChange={(e) => setAddress(e.target.value)} />
                <input value={phone} type="text" placeholder='Phone' onChange={(e) => setPhone(e.target.value)} />
              </>
              : null}
            <input value={email} type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            <input value={password} type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            <button type='submit' className='login-btn'>{signState}</button>

            <div className="form-help">
              <div className="remember">
                <input checked={rememberMe} type="checkbox" id='remember-me' onChange={(e) => setRememberMe(e.target.checked)} />
                <label htmlFor="remember-me">Remember me</label>
              </div>
              <p>Need help?</p>
            </div>
          </form>
          <div className="form-switch">
            {signState === 'Sign In' ?
              <p>New to Netflix? <span onClick={() => setSignState('Sign Up')}>Sign up now.</span></p>
              :
              <p>Already have account? <span onClick={() => setSignState('Sign In')}>Sign in now.</span></p>
            }
          </div>
        </div>
      </div>
  )
}
