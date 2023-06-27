
import { useState, useEffect } from 'react' 
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
// import axios from 'axios'
import clienteAxios from '../config/clienteAxios'

const Registrar = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepetido, setPasswordRepetido] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async (e) => {

    e.preventDefault()
    
    if([nombre, email, password, passwordRepetido].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios!',
        error: true
      })
      return
    }

    if(password !== passwordRepetido){
      setAlerta({
        msg: 'Los passwords no son iguales',
        error: true
      })
      return
    }

    if(password.length < 6){
      setAlerta({
        msg: 'El password debe contener al menos seis(6) caracteres',
        error: true
      })
      return
    }
    setAlerta({})

    //CREAR EL USUARIO EN LA API
    try {
      const {data} = await clienteAxios.post ('/usuarios', 
        {
          nombre,
          email,
          password
        }
      )
      setAlerta(
        {
          msg: data.msg,
          error: false
        }
      )
      //Reiniciar formulario
      setNombre('')
      setEmail('')
      setPassword('')
      setPasswordRepetido('')
    } 
    catch (error) {
      const {data} = error.response
      setAlerta(
        {
          msg: data.msg,
          error: true
        }
      )
    }
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Crea Tu Cuenta y Administra {" "}
        <span className="text-slate-700">Tus Proyectos</span>
      </h1>

      <form 
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        {alerta.msg && <Alerta alerta={alerta} /> }

        <div className="my-5">
          <label 
            htmlFor="email" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >Nombre</label>
          <input 
            type="text" 
            placeholder="Registra tu nombre"
            id="nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={nombre}
            onChange={ e => setNombre(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label 
            htmlFor="email" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >Email</label>
          <input 
            type="email" 
            placeholder="Registra tu correo"
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

        <div className="my-5">
          <label 
            htmlFor="password2" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >Repetir Password</label>
          <input 
            type="password" 
            id="password2"
            placeholder="Repetir password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={passwordRepetido}
            onChange={ e => setPasswordRepetido(e.target.value)}
          />
        </div>

        <input 
          type="submit" 
          value="Crear Cuenta"
          id="input-registrar"
          className="w-full bg-sky-700 mb-5 text-white uppercase font-bold rounded py-3 hover:cursor-pointer hover:bg-sky-900 transition-colors"
            />

      </form>

      <nav className="lg:flex lg:justify-between">
          <Link 
              to={'/'}
              className='block text-center my-5 text-slate-500 capitalize text-sm'
          >¿Ya tienes una cuenta? Inicia Sesión aquí</Link>

          <Link 
              to={'/olvide-password'}
              className='block text-center my-5 text-slate-500 capitalize text-sm'
          >¿Olvidaste tu password?</Link>
      </nav>
  </>
  )
}

export default Registrar