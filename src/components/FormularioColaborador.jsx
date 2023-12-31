
import { useState } from "react"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"

const FormularioColaborador = () => {

    const [ email, setEmail ] = useState('')
    const { mostrarAlerta, alerta, submitColaborador } = useProyectos()

    const handleSubmit = async  e => {
        e.preventDefault()

        if(email === '') {
            mostrarAlerta({
                msg: 'El email es obligatorio',
                error: true
            })
            return
        }
        await submitColaborador(email)
        // setEmail('')
    }

  return (
    <form 
        className="bg-white py-10 px-5 w-full sm:w-4/5 xl:w-1/2 rounded-lg shadow"
        onSubmit={ handleSubmit }
        action=""
    >
        {alerta.msg && <Alerta alerta={alerta} />}

        <div className='mb-5'>
            <label 
                className='text-gray-700 uppercase font-bold text-sm'
                htmlFor="email"
            >Email Colaborador</label>

            <input 
                type="email"
                id='email'
                placeholder='Correo del usuario a buscar'
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                value={email}
                onChange={ (e) => setEmail(e.target.value) }
            />

        </div>

        <input
            type='submit'
            className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm'
            value={'Buscar Colaborador'}
        />

    </form>
  )
}

export default FormularioColaborador