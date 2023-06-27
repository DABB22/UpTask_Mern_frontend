
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import Login from './paginas/Login'
import Registrar from './paginas/Registrar'
import OlvidePassword from './paginas/OlvidePassword'
import NuevoPassword from './paginas/NuevoPassword'
import ConfirmarCuenta from './paginas/ConfirmarCuenta'
import RutaProtegida from './layouts/RutaProtegida'
import Proyectos from './paginas/Proyectos'
import CrearProyecto from './paginas/CrearProyecto'
import Proyecto from './paginas/Proyecto'
import EditarProyecto from './paginas/EditarProyecto'
import NuevoColaborador from './paginas/NuevoColaborador'

import { AuthProvider } from './context/AuthProvider.jsx'
import { ProyectosProvider } from './context/ProyectosProvider.jsx'

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <ProyectosProvider> {/* Se coloca rodeando todas las rutas depues del AuthProvider porque no se puede colocar dentro del componente Routes ya que no acepta como hijo un provider */}
          <Routes>

            <Route path='/' element={ <AuthLayout /> }> {/* el path es la ruta y el element es lo que se muestra */}
              <Route index element={ <Login /> } />
              <Route path='registrar' element={ <Registrar /> } />
              <Route path='olvide-password' element={ <OlvidePassword /> } />
              <Route path='olvide-password/:token' element={ <NuevoPassword /> } />
              <Route path='confirmar/:id' element={ <ConfirmarCuenta /> } />
            </Route>

            <Route path='/proyectos' element={ <RutaProtegida/> }>
              <Route index element={ <Proyectos/> }/>
              <Route path='crear-proyecto' element={ <CrearProyecto/> }/>
              <Route path='nuevo-colaborador/:id' element={ <NuevoColaborador/> }/>
              <Route path=':id' element={ <Proyecto/> }/>
              <Route path='editar/:id' element={ <EditarProyecto/> }/>
            </Route>

          </Routes>
        </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
