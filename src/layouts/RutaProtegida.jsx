
import { Outlet, Navigate} from 'react-router-dom'
import useAuth from '../hooks/useAuth.jsx'
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx'

const RutaProtegida = () => {

    const { auth, cargando } = useAuth()

   if(cargando) return 'Cargando...' // state para dar un tiempo a que se llene el state de auth con los datos del usuario y poder loguearlo en la app

  return (
    <>
        {auth._id ? (

            <div className='bg-gray-100'>
                <Header/>

                <div className='md:flex md:min-h-screen'>
                    <Sidebar/>

                    <main className='flex-1 p-10'>
                        <Outlet />
                    </main>
                </div>
            </div>
            
        
        ) : <Navigate to={'/'}/> }
    </>
  )
}

export default RutaProtegida