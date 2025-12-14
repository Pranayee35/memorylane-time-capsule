import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { CreateCapsule } from "./pages/CreateCapsule";
import { CapsuleDetails } from "./pages/CapsuleDetails";
export const App = ()=>{
  return(
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
       <Route path="/create" element={<CreateCapsule/>}/>
      <Route path="/capsule" element={<CapsuleDetails/>}/> 
    </Routes> 
  );
};
