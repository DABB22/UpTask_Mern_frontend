

import { useState, useEffect, createContext } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import clienteAxios from "../config/clienteAxios"
import io from 'socket.io-client'

let socket;

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {

  const [proyectos, setProyectos] = useState([])
  const [proyecto, setProyecto] = useState({})
  const [alerta, setAlerta] = useState({})
  const [cargando, setCargando] = useState(false)
  const [modalFormularioTarea, setFormularioTarea] = useState(false)
  const [tarea, setTarea] = useState({})
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
  const [loading, setLoading ] = useState(false)
  const [colaborador, setColaborador] = useState({}) 
  const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false) 
  const [buscador, setBuscador] = useState(false) 

  const navigate = useNavigate()
  const { auth } = useAuth()

  //*-------- useEffect obtener proyectos
  useEffect (()=> {

    const obtenerProyectos = async () => {

      try {
        const token = localStorage.getItem('token');
        if(!token) return
  
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }  
        const {data} = await clienteAxios('/proyectos', config)
        setProyectos(data)
      } 
      catch (error) {
        console.log(error)
      }
    }

    obtenerProyectos()

  },[auth])

  useEffect (()=>{
    socket = io(import.meta.env.VITE_BACKEND_URL)
  },[])



//*-------- mostrar alerta
  const mostrarAlerta = (alerta) => {
    setAlerta(alerta)
    setTimeout(() => {
      setAlerta({})
    }, 3000);
  }

//*-------- submit proyecto
  const submitProyecto = async proyecto => {
    if(!proyecto.id){
      await crearProyecto(proyecto)
    }else{
      await editarProyecto(proyecto)
    }
  }
//*-------- crear proyecto
  const crearProyecto = async proyecto => {
    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post('/proyectos', proyecto, config)
      setProyectos([...proyectos, data])
      setAlerta({
        msg: 'Proyecto Creado Correctamente',
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 1500);

    } catch (error) {
      console.log(error)
    }
  }

  //*-------- editar proyecto
  const editarProyecto = async proyecto => {
    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

      //sincronizar el state de la vista de proyectos con el proyecto editado
      const proyectosActualizados = proyectos.map( proyectoState => proyectoState._id === data._id ? data : proyectoState)
      setProyectos(proyectosActualizados)

      setAlerta({
        msg: 'Proyecto Editado Correctamente',
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate(`/proyectos/${proyecto.id}`)
      }, 1500);

    } catch (error) {
      console.log(error)
    }
  }

//*-------- obtener proyecto
  const obtenerProyecto = async (id) => {

    setCargando(true)
    
    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios(`/proyectos/${id}`, config)
      setProyecto(data)
      
    } 
    catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    } 
    finally {setCargando(false)}
  }

  //*-------- Eliminar proyecto
  const eliminarProyecto = async id => {
    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)

      //sincronizar el state de la vista de proyectos con el proyecto editado
      const proyectosActualizados = proyectos.filter( proyectoState => proyectoState._id !== id)

      setProyectos(proyectosActualizados)

      setAlerta({
        msg: data.msg,
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate(`/proyectos`)
      }, 1500);
      
    } catch (error) {
      console.log(error)
    }
  }

  //*-------- Handel Modal Tarea
  const handleModalTarea = () => {
    setFormularioTarea(!modalFormularioTarea)
    setTarea({})
  }

  //*-------- Submit Tarea 
  const submitTarea = async tarea => {
    if(tarea.id){
     await editarTarea(tarea)
    }
    else{
      await crearTarea(tarea)
    }
  }
  //*-------- Crear Tarea
  const crearTarea = async tarea  => {
    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`/tareas`, tarea, config)
      
      setAlerta({
        msg: 'Tarea agregada correctamente',
        error: false
      })
      setTimeout(() => {
        setAlerta({})
        setFormularioTarea(false)
      }, 1000);

      //! SOKET.IO

      socket.emit('nueva tarea', data)

    } catch (error) {
      console.log(error)
    }
  }

  //*-------- Editar Tarea
  const editarTarea = async tarea => {
    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            
      setAlerta({
        msg: 'Tarea actualizada correctamente',
        error: false
      })
      setTimeout(() => {
        setAlerta({})
        setFormularioTarea(false)
      }, 1000);

      //! SOCKET.IO

      socket.emit('editar tarea', data)
      
    } catch (error) {
      console.log(error)
    }
  }

  const handleModalEditarTarea = tarea => {
    setTarea(tarea)
    setFormularioTarea(true)
  }

  const handleModalEliminarTarea = tarea => {
    setTarea(tarea)
    setModalEliminarTarea(!modalEliminarTarea)
  }

  //*-------- Eliminar Tarea
  const eliminarTarea = async () => {

    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            
      setAlerta({
        msg: data.msg ,
        error: false
      })

      //! SOCKET.IO

      socket.emit('eliminar tarea', tarea)

      setTimeout(() => {
        setAlerta({})
        setModalEliminarTarea(false)
        setTarea({})
      }, 2000);

    } 
    catch (error) {
      console.log(error)
    }

  }

  const submitColaborador = async email => {

    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`proyectos/colaboradores`, {email}, config)
    
      //Actualizar el State con el colaborador y mostrarlo
      setColaborador(data)

    } 
    catch (error) {
      console.log(error.response)

      setColaborador({})
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      setTimeout(() => {
        setAlerta({})
      }, 2000);
    }
    finally{
      setLoading(false)
    }

  }

  const agregarColaborador = async (email) => {
    
    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`proyectos/colaboradores/${proyecto._id}`, email, config)
      console.log(data)

      setAlerta({
        msg: data.msg,
        error: false
      })
      setTimeout(() => {
        setAlerta({})
        setColaborador({})
      }, 2000);

    } 
    catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      setTimeout(() => {
        setAlerta({})
      }, 2000);
    }
  }

  const handleModalEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador)
    setColaborador(colaborador)
  }

  const eliminarColaborador = async () => {

    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)
      console.log(data)

      //Actualizar el State de colaboradores y visualizarlos
      const proyectoActualizado = { ...proyecto }
      proyectoActualizado.colaboradores = proyecto.colaboreadores?.filter( colaboradorState => colaboradorState._id !== colaborador._id )
      setProyecto(proyectoActualizado)

      setAlerta({
        msg: data.msg,
        error: false
      })
      setTimeout(() => {
        setAlerta({})
        setColaborador({})
        setModalEliminarColaborador(false)
      }, 2000);

    } 
    catch (error) {
      console.log(error)
    }
  }

  const completarTarea = async (id) => {
    
    try {
      const token = localStorage.getItem('token');
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`tareas/estado/${id}`,{}, config)

      setTarea({})
      setAlerta({})

      //! SOCKET.IO

      socket.emit('cambiar estado', data)


    } catch (error) {
      console.log(error)
    }
  }

  const handleBuscador = () => {
    setBuscador(!buscador)
  }

  //! SOCKET.IO - funciones que reaccionan a los eventos 

  const submitTareasProyecto = (tareaNueva) => {
    //Actualizar el state de las tareas usando socket.io
    const proyectoActualizado = { ...proyecto }
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tareaNueva]
    setProyecto(proyectoActualizado)
  }

  const submitEliminarTarea = tareaEliminada => {
        //Actualizar el state de las tareas usando socket.io
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter( tareaState => tareaState._id !== tareaEliminada._id)
        setProyecto(proyectoActualizado)
  }

  const submitTareaEditada = tareaEditada => {
          //Agregar la tarea al state de proyecto y visualizarla 
          const proyectoActualizado = { ...proyecto }
          proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tareaEditada._id ? tareaEditada : tareaState )
          setProyecto(proyectoActualizado)
  }

  const submitCambiarEstadoTarea = tareaEstadoActualizado => {
    //Actualizar el State con el estado de la tarea y visualizarla
    const proyectoActualizado = { ...proyecto }
    proyectoActualizado.tareas = proyectoActualizado.tareas.map ( tareaState => tareaState._id === tareaEstadoActualizado._id ? tareaEstadoActualizado : tareaState )
    setProyecto(proyectoActualizado)
  }

  const cerrarSesionProyectos = () => {
      setProyectos([])
      setProyecto({})
      setAlerta({})
  }

    
  return (
   <ProyectosContext.Provider
    value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        setColaborador,
        agregarColaborador,
        loading,
        modalEliminarColaborador,
        handleModalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        handleBuscador,
        buscador,
        submitTareasProyecto,
        submitEliminarTarea,
        submitTareaEditada,
        submitCambiarEstadoTarea,
        cerrarSesionProyectos

    }}
   >
    {children}
   </ProyectosContext.Provider>
  )
}

export {
    ProyectosProvider
}

export default ProyectosContext