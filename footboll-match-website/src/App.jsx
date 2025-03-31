import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './componants/Sidebar';
import Team from './componants/Team';
import Field from './componants/Field';

function App() {
  const [active, setActive] = useState(1);
  const [teamData, setTeamData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [backupData, setBackupData] = useState([]);
  const [selectFieldData, setSelectFieldData] = useState();
  const [headingEdited, setHeadingEdited] = useState(false);
  
  return (
    <BrowserRouter>
      <Sidebar active={active} setActive={setActive} />
      <Routes>
        <Route path="/" element={<Team headingEdited={headingEdited} setHeadingEdited={setHeadingEdited} selectFieldData={selectFieldData} setSelectFieldData={setSelectFieldData} teamData={teamData} setTeamData={setTeamData} fileName={fileName} setFileName={setFileName} backupData={backupData} setBackupData={setBackupData} setActive={setActive} />} />
        <Route path="/field" element={<Field headingEdited={headingEdited} setHeadingEdited={setHeadingEdited} backupData={backupData} setActive={setActive} fileName={fileName} setFileName={setFileName} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
