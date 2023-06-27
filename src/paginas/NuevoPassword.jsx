
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
// import axios from 'axios'
import clienteAxios from '../config/clienteAxios.jsx'
import Alerta from '../components/Alerta.jsx'


const NuevoPassword = () => {
  const params = useParams()
  const {token}=params
  const [alerta, setAlerta] = useState({})
  const [tokenValido, setTokenValido] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordModificado, setPasswordModificado] = useState(false)

  useEffect(() =>{
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)
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
    return () => {comprobarToken()}
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()

    if(password === '' || password.length < 6){
      setAlerta({
        msg: 'El password es obligatorio y debe contener al menos 6 caracteres',
        error: true
      })
    }

    try {
      const {data} = await clienteAxios.post (`/usuarios/olvide-password/${token}`, 
      {
        password,
      }
    )
    setAlerta(
      {
        msg: data.msg,
        error: false
      }
    )
    setPassword('')
    setPasswordModificado(true)

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
      <h1 className="text-sky-600 font-black text-6xl text-center">UpTask</h1>
      <h2 className="text-sky-600 font-black text-4xl text-center">Reestablece   {" "}
        <span className="text-slate-700">Tu Password</span>
      </h2>

      {alerta.msg && <Alerta alerta={alerta}/>}

      {(tokenValido && !passwordModificado) && (

          <form 
            className='mt-20'
            onSubmit={handleSubmit}
          >
          <div className="my-5">
            <label 
              htmlFor="password" 
              className="uppercase text-gray-600 block text-xl font-bold"
            >Nuevo Password</label>
            <input 
              type="password" 
              id="password"
              placeholder="Digita tu nuevo password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={ e => setPassword(e.target.value)}
            />
          </div>
  
          <input 
            type="submit" 
            value="Actualizar Password"
            id="input-registrar"
            className="w-full bg-sky-700 mb-5 text-white uppercase font-bold rounded py-3 hover:cursor-pointer hover:bg-sky-900 transition-colors"
          />
  
        </form>
        
      )}

      { passwordModificado &&
        <Link 
            to={'/'}
            className='block text-center my-5 text-slate-500 capitalize text-sm'
        > Iniciar Sesión</Link>
      }



  </>
  )
}

export default NuevoPassword