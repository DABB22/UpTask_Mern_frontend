
import { useState, useEffect } from "react"
import Alerta from "./Alerta"
import { useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"

const FormularioProyecto = () => {

    const [ nombre, setNombre] = useState('')
    const [ descripcion, setDescipcion] = useState('')
    const [ fechaEntrega, setFechaEntrega] = useState('')
    const [ cliente, setCliente] = useState('')
    const [ id, setId] = useState(null)

    const params = useParams()

    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos()

    useEffect(()=>{
        if(params.id){
            setId(params.id)
            setNombre(proyecto.nombre)
            setDescipcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }
    },[params])
    

    const handleSubmit = async (e) => {
        e.preventDefault()

        if([nombre, descripcion, fechaEntrega, cliente].includes('')){
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        //Enviar los datos
       await  submitProyecto({nombre, descripcion, fechaEntrega, cliente, id})
        
        setId(null)
        setNombre('')
        setDescipcion('')
        setFechaEntrega('')
        setCliente('')
    }

  return (
    <form
        className="bg-white py-5 px-5 md:w-1/2 rounded-lg shadow"
        onSubmit={handleSubmit}
    >
        {alerta.msg && <Alerta alerta={alerta}/> }
        <div className="mb-5">
            <label 
                htmlFor="nombre"
                className="text-gray-700 uppercase font-bold text-sm"
            >Nombre Proyecto</label>
            <input 
                className="border w-full p-2 placeholder-gray-300 rounded-md"
                type="text" 
                id="nombre"
                placeholder="Nombre del proyecto"
                value={nombre}
                onChange={ e => setNombre(e.target.value)}
            />
        </div>

        <div className="mb-5">
            <label 
                htmlFor="descripcion"
                className="text-gray-700 uppercase font-bold text-sm"
            >Descripción</label>
            <textarea 
                className="border w-full p-2 placeholder-gray-300 rounded-md"
                id="descripcion"
                placeholder="Descripción del proyecto"
                value={descripcion}
                onChange={ e => setDescipcion(e.target.value)}
            />
        </div>

        <div className="mb-5">
            <label 
                htmlFor="fecha-entrega"
                className="text-gray-700 uppercase font-bold text-sm"
            >Fecha de Entrega</label>
            <input 
                className="border w-full p-2 placeholder-gray-300 rounded-md"
                type="date" 
                id="fecha-entrega"
                value={fechaEntrega}
                onChange={ e => setFechaEntrega(e.target.value)}
            />
        </div>

        <div className="mb-5">
            <label 
                htmlFor="cliente"
                className="text-gray-700 uppercase font-bold text-sm"
            >Cliente</label>
            <input 
                className="border w-full p-2 placeholder-gray-300 rounded-md"
                type="text" 
                id="cliente"
                placeholder="Nombre del cliente"
                value={cliente}
                onChange={ e => setCliente(e.target.value)}
            />
        </div>

        <input 
            className=" bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
            type="submit"
            value={params.id ? 'Guardar Cambios': 'Crear Proyecto'}
        />

    </form>
  )
}

export default FormularioProyecto