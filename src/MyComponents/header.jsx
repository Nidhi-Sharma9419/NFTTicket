
import image from '../logo.svg'
//import wallet from '../assets/metamask-logo.png'

import { useLocation, useNavigate } from "react-router-dom";
export default function Header() {
const location = useLocation();
const navigate = useNavigate();
function pathMatchRoute(route) {
    if (route === location.pathname) {
        return true;
    }
}
    return (
        <div className='bg-zinc-900 border-b shadow-sm sticky top-0 z-50'>
            <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
                <div>
                    <img src={image} alt='NFTix'
                        className='h-16 cursor-pointer'
                        onClick={() => navigate("/")}
                    />
                

                </div>
                <div>

                <ul className='flex space-x-5'>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/") && "text-black border-b-red-500"
                            }`} onClick={() => navigate("/")}
                        >Home</li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]
                border-b-transparent ${pathMathRoute('/connect') && "text-black border-b-red-500"}`}
                            onClick={() => navigate("/connect")}>Connect</li>


                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]
                border-b-transparent ${pathMathRoute("/events") && "text-black border-b-red-500"}`}
                            onClick={() => navigate("/events")}>Events</li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]
                border-b-transparent ${pathMathRoute("/book-tickets") && "text-black border-b-red-500"}`}
                            onClick={() => navigate("/book-tickets")}>BookTickets</li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]
                border-b-transparent ${pathMatchRoute("/book-tickets") && "text-black border-b-red-500"}`}
                            onClick={() => navigate("resale-tickets")}>Resale</li>
                    </ul>
                </div> 
                




            </header>
        </div>
    )
}
