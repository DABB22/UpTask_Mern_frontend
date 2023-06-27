
import { formatearFecha } from "../helpers/formatearFecha"
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"

const Tarea = ({tarea}) => {

    const {handleModalEditarTarea, handleModalEliminarTarea, completarTarea} = useProyectos()
    const { nombre, descripcion, prioridad, fechaEntrega, estado, _id } = tarea
    const admin = useAdmin()

  return (
    <div className="border-b p-5 flex flex-col md:flex-row justify-between items-center">
        <div
            className="flex flex-col items-start"
        >
            <p className="mb-1 text-xl">{nombre}</p>
            <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
            <p className="mb-1 text-gray-600">Prioridad: {prioridad}</p>
            <p className="mb-1 text-lg">Fecha Limite: {formatearFecha(fechaEntrega)}</p>
            { estado && 
                <p
                    className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white"
                >Completada por: {tarea.completado.nombre}</p>}
        </div>

        <div className="flex gap-2 mt-5 md:mt-0">
            {admin && (
                <button
                    className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    onClick={ () => handleModalEditarTarea(tarea) }
                >Editar</button>   
            )}

            <button
                className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                onClick={ () => completarTarea(_id)}
            >{estado ? 'Completa' : 'Incompleta'}</button>

            {admin && (
                <button
                    className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    onClick={ () =>  handleModalEliminarTarea(tarea) }
                >Eliminar</button>            
            )}
        </div>
    </div>
  )
}

export default Tarea