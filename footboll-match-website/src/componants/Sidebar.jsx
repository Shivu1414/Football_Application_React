import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import GroupsIcon from '@mui/icons-material/Groups';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const Sidebar = ({active, setActive}) => {
    const navigate = useNavigate();

    function activatePage(id){
        setActive(id);
        id == 1 ? navigate("/") : navigate("/field");
    }

    return (
        <div className='side-bar'>
            <div className='logo'>
                <img src='../football-logo.jpeg' className='logo-img' onClick={()=>activatePage(1)} />
            </div>
            <div className='sidebar-content-top'>
                <div className='sidebar-content'>
                    <div className='menubar' style={{color: active == 1 ? "#fbb400" : "white"}}>
                    {
                        active === 1 ? <div className='dot-top'><FiberManualRecordIcon className='dot' /></div> : ""
                    }
                        <MenuIcon className='menu-item' onClick={()=>activatePage(1)} />
                    </div>
                    <div className='menubar group-icon' style={{color: active == 2 ? "#fbb400" : "white"}}>
                    {
                        active === 2 ? <div className='dot-top'><FiberManualRecordIcon className='dot' /></div> : ""
                    }
                        <GroupsIcon className='menu-item' onClick={()=>activatePage(2)} /></div>
                </div>
            </div> 
        </div>
    );
}

export default Sidebar;