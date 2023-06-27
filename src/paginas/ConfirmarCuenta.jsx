
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
// import axios from "axios"
import clienteAxios from "../config/clienteAxios.jsx"
import Alerta from "../components/Alerta.jsx"

const ConfirmarCuenta = () => {

  const [alerta, setAlert] = useState({})
  const [linkLogin, setLinkLogin] = useState(false)

  const params = useParams()
  const {id} = params

  useEffect( () => {
    const confirmarCuenta = async ()=> {
      try {
        const url = `/usuarios/confirmar/${id}`
        const {data} = await clienteAxios(url)
        setAlert({
          msg: data.msg,
          error: false
        })
        setLinkLogin(true)
      } 
      catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    return () => {confirmarCuenta()}
  },[])

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl text-center mb-10">UpTask</h1>
      <h2 className="text-sky-600 font-black text-4xl text-center">Crea y Administra {" "}
        <span className="text-slate-700">Tus Proyectos</span>
      </h2>
      <div className="flex flex-col items-center mt-20 md:mt-5 shadow-lg py-10 rounded-xl bg-white"> 

        <div className="w-4/5">{alerta.msg && <Alerta alerta={alerta}/>}</div> 

        {linkLogin && 
        <Link 
          to={'/'}
          className="bg-sky-600 w-36 mt-5 text-center text-white uppercase font-bold rounded py-3 px-1 hover:cursor-pointer hover:bg-sky-900 transition-colors  "
        >Iniciar Sesión</Link>}

      </div>


    </>
  )
}

export default ConfirmarCuenta