import {
  BrowserRouter,
  Routes,
  Route,     //
} from "react-router-dom";
import './App.css';

import { SigninPage } from "./component/signIn/SignIn";
import { Sidebar } from "./component/sidebar/Sidebar";
import { MainLayout } from "./component/mainLayout";
import {Navbar} from './component/Navbar/Navbar'
import { Home } from "./component/home/home";
import { Send } from "./component/Transaction/Send";
import { TransactionHistory } from "./component/Transaction/History";
import { SignupPage } from "./component/signUp/SignUp";


function App() {
  return (
   
    <>

          <BrowserRouter>

              <Navbar />
              <MainLayout />

              <Routes>
              <Route path = "/" element = {<SigninPage/>}/>


              <Route path= "/signUp" element={<SignupPage/>}/>
              <Route path= "/acc/det" element={ <Home/>} />
              <Route path= "/trans/send" element= {<Send/>}/>
              <Route path= "/trans/hist" element= {<TransactionHistory/>}/>

              </Routes>
          
          
          </BrowserRouter>
    
    </>
  );
}


          const Wrapper = () => {
            return (
              <>
                <Navbar />
                <MainLayout />
                <Home/>
              </>
            );
          };

export default App;
