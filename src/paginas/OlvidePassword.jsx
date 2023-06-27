
import { Link } from 'react-router-dom'
import { useState } from 'react'
// import axios from 'axios'
import clienteAxios from '../config/clienteAxios.jsx'
import Alerta from '../components/Alerta.jsx'


const OlvidePassword = () => {

  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async e => {
    e.preventDefault()

    if(email === '' || email.length < 6){
      setAlerta({
        msg: 'El email es obligatorio',
        error: true
      })
      return
    }

    setAlerta({})
    //SOLICITAR CAMBIO DE CONTRASEÑA
    try {
      const {data} = await clienteAxios.post (`/usuarios/olvide-password`, 
        {
          email,
        }
      )
      setAlerta(
        {
          msg: data.msg,
          error: false
        }
      )
      //Reiniciar formulario
      setEmail('')
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
      <h1 className="text-sky-600 font-black text-6xl">Recupera Tu Acceso y No Pierdas{" "}
        <span className="text-slate-700">Tus Proyectos</span>
      </h1>

      {alerta.msg && <Alerta alerta={alerta} />}
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
            placeholder="Registra tu correo"
            id="email"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={ e => setEmail(e.target.value)}
          />
        </div>

        <input 
          type="submit" 
          value="Solicitar nuevo password"
          id="input-olvide"
          className="w-full bg-sky-700 mb-5 text-white uppercase font-bold rounded py-3 hover:cursor-pointer hover:bg-sky-900 transition-colors"
            />

      </form>

      <nav className="lg:flex lg:justify-between">
          <Link 
              to={'/'}
              className='block text-center my-5 text-slate-500 capitalize text-sm'
          >¿Ya tienes una cuenta? Inicia Sesión aquí</Link>

          <Link 
              to={'/registrar'}
              className='block text-center my-5 text-slate-500 capitalize text-sm'
          >¿No tienes una cuenta?, registrate aquí</Link>
      </nav>
  </>
  )
}


export default OlvidePassword