
import FormularioColaborador from "../components/FormularioColaborador"
import { useEffect, useState } from "react"
import useProyectos from "../hooks/useProyectos"
import { useParams } from "react-router-dom"
import Alerta from "../components/Alerta"


const NuevoColaborador = () => {

    const { obtenerProyecto, proyecto, 
            cargando, colaborador, 
            agregarColaborador, alerta, 
            loading, setColaborador
        } = useProyectos()

    const params = useParams()

    useEffect(()=>{
        obtenerProyecto(params.id)
        setColaborador({})
    }, [])

    if (cargando) return 'cargando...'
    if(!proyecto?._id) return <Alerta alerta={alerta}/>

  return (
    <>
    
        <h1 className="text-4xl font-black">Añadir Colaborador(a) Proyecto: {proyecto.nombre}</h1>

        <div className="mt-10 flex justify-center">
            <FormularioColaborador/>
        </div>

        {loading ? <p className="mt-5 text-center">Cargando...</p> :  colaborador?.nombre && (
            <div
                className="bg-white my-10 mx-auto py-10 px-5 w-full sm:w-4/5 xl:w-1/2 rounded-lg shadow"
            >
                <h2
                    className="text-center mb-10 text-2xl font-bold"
                >Resultado:</h2>

                <div className="flex justify-between items-center">
                    <p>{colaborador.nombre}</p>

                    <button
                        type="button"
                        className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
                        onClick={ () => agregarColaborador({
                            email: colaborador.email
                        })}
                    >Agregar al proyecto</button>
                </div>
            </div>
        )}
    
    </>
  )
}

export default NuevoColaborador