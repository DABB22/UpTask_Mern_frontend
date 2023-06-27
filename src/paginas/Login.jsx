
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'
import useAuth from '../hooks/useAuth.jsx'

const Login = () => {

    const [alerta, setAlerta] = useState({})
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setAuth } = useAuth()

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()

        if ([email, password].includes('')){
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
        }

        try {
            const {data} = await clienteAxios.post('/usuarios/login',{
                email,
                password,
            })
            setAlerta({})
            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/proyectos')
        } 
        catch (error) {
            console.log(error)
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }

  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl">Inicia Sesión y Administra {" "}
            <span className="text-slate-700">Tus Proyectos</span>
        </h1>

        {alerta.msg && <Alerta alerta={alerta}/>}

        <form 
            className="my-10 bg-white shadow rounded-lg p-10"
            onSubmit={handleSubmit}
        >

            <div className="my-5">
                <label 
                    htmlFor="email" 
                    className="uppercase text-gray-600 block text-xl font-bold"
                >Email</label>
                <input 
                    type="email" 
                    placeholder="Ingresa tu correo"
                    id="email"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    value={email}
                    onChange={ e => setEmail(e.target.value)}
                />
            </div>

            <div className="my-5">
                <label 
                    htmlFor="password" 
                    className="uppercase text-gray-600 block text-xl font-bold"
                >Password</label>
                <input 
                    type="password" 
                    id="password"
                    placeholder="Digita tu password"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    value={password}
                    onChange={ e => setPassword(e.target.value)}
                />
            </div>

            <input 
                    type="submit" 
                    value="Iniciar Sesión"
                    id="input-login"
                    className="w-full bg-sky-700 mb-5 text-white uppercase font-bold rounded py-3 hover:cursor-pointer hover:bg-sky-900 transition-colors"
                />

        </form>

        <nav className="lg:flex lg:justify-between">
            <Link 
                to={'/registrar'}
                className='block text-center my-5 text-slate-500 capitalize text-sm'
            >¿No tienes una cuenta? Registrate aquí</Link>

            <Link 
                to={'/olvide-password'}
                className='block text-center my-5 text-slate-500 capitalize text-sm'
            >¿Olvidaste tu password?</Link>
        </nav>
    </>
  )
}

export default Login