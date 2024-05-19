import AllEmployees from './Employees/allEmloyees';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import AllRoles from './roles/allRoles';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AllEmployees></AllEmployees>}></Route>
          <Route path='roles' element={<AllRoles></AllRoles>}></Route>        
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
