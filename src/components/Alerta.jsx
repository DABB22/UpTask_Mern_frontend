


const Alerta = ({alerta}) => {
  return (
    <div className={`${alerta.error ? 'from-red-400 to-red-600' : 'from-sky-400 to-sky-600'} bg-gradient-to-br text-center p-2 rounded-lg uppercase text-white font-bold text-xs  mb-2`}>
        {alerta.msg}
    </div>
  )
}

export default Alerta