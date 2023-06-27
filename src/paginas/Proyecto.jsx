
import { useEffect } from 'react'
import {useParams, Link} from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import ModalFormularioTarea from '../components/ModalFormularioTarea'
import ModalEliminarTarea from '../components/ModalEliminarTarea'
import useAdmin from '../hooks/useAdmin'
import ModalEliminarColaborador from '../components/ModalEliminarColaborador'
import Colaboreador from '../components/Colaboreador'
import Tarea from '../components/Tarea'
import Alerta from '../components/Alerta'
import io from 'socket.io-client'

let socket;


const Proyecto = () => {

    const params = useParams()
    const { obtenerProyecto, proyecto, cargando,handleModalTarea, alerta, submitTareasProyecto, submitEliminarTarea, submitTareaEditada, submitCambiarEstadoTarea } = useProyectos()
    const admin  = useAdmin()

    const {nombre} = proyecto

    useEffect(()=>{
        obtenerProyecto(params.id)
    },[])

    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit( 'abrir proyecto', params.id)
    },[])

    useEffect(()=>{
      socket.on('tarea agregada', (tareaNueva)=> {
        if(tareaNueva.proyecto === proyecto._id){
          submitTareasProyecto(tareaNueva)
        }
      })

      socket.on('tarea eliminada', (tareaEliminada)=> {
        if(tareaEliminada.proyecto === proyecto._id){
          submitEliminarTarea(tareaEliminada)
        }

      })

      socket.on('tarea editada', (tareaEditada)=> {
        if(tareaEditada.proyecto._id === proyecto._id){
          submitTareaEditada(tareaEditada)
        }

      })

      socket.on('nuevo estado', (tareaEstadoActualizado)=> {
        if(tareaEstadoActualizado.proyecto._id === proyecto._id){
          submitCambiarEstadoTarea(tareaEstadoActualizado)
        }

      })
    })

    if(cargando) return 'Cargando...'
    if(!proyecto._id) return <Alerta alerta={alerta}/>

  return (
    <>
      <div className='flex items-end gap-5'>
          <h1 className="font-black text-4xl">{nombre}</h1>
          {admin && (
            <div className='flex gap-1 items text-gray-400 hover:text-black'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                <Link
                  className='uppercase font-bold'
                  to={`/proyectos/editar/${params.id}`}
                >Editar</Link>
            </div>    
          )}
      </div>
      
      {admin && (
        <button
          onClick={ handleModalTarea }
          type='button'
          className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 justify-center items-center'
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
          </svg>
          Nueva Tarea
        </button>
      )}
      <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>

      <div className="bg-white shadow mt-10 rounded-lg">

        {proyecto.tareas?.length ? 
          proyecto.tareas?.map( tarea => (
            <Tarea
              key={tarea._id}
              tarea={tarea}
            />
          )) : 
          <p className='text-center my-5 p-10'>Aún no se han asignado tareas al proyecto</p>}

      </div>
      {admin && (
        <>
          <div className="flex items-end justify-between gap-5 mt-10">
            <p className='font-bold text-xl'>Colaboradores</p>
            
            <div
              className='flex items-center items text-gray-400 hover:text-black'
            >
              <Link
                to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                className='uppercase font-bold'
              >Añadir</Link>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
          </div>
      
        <div className="bg-white shadow mt-10 rounded-lg">

          {proyecto.colaboradores?.length ? 
            proyecto.colaboradores?.map( colaborador => (
              <Colaboreador
                key={colaborador._id}
                colaborador={colaborador}
              />
            )) : 
            <p className='text-center my-5 p-10'>Aún no se han asignado colaboradores al proyecto</p>}
            
        </div>
      </>
      )}

      <ModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
    )
}

export default Proyecto