import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { CreateCapsule } from "./pages/CreateCapsule";
import { CapsuleDetails } from "./pages/CapsuleDetails";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
export const App = ()=>{
  return(
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
       <Route path="/create" element={<CreateCapsule/>}/>
      <Route path="/capsule/access/:token" element={<CapsuleDetails/>}/> 
      <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    </Routes> 
  );
};
