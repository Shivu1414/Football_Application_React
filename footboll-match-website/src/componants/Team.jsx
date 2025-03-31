import React, { useState, useRef, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import Swal from 'sweetalert2';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function Team({ headingEdited, setHeadingEdited, teamData, setTeamData, fileName, setFileName, backupData, setBackupData, setActive, selectFieldData, setSelectFieldData }) {
  const fileInputRef = useRef(null);
  const selectorRef1 = useRef(null);
  const selectorRef2 = useRef(null);
  const [searching, setSearching] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [actionDropdown, setActionDropdown] = useState(null);
  const [actionEdit, setActionEdit] = useState(null);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [teamLen, setTeamLen] = useState();
  const [editData, setEditData] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [searchActive, setSearchActive] = useState(false);
  const [headingActive, setHeadingActive] = useState(false);
  const [tempFileName, setTempFileName] = useState("");
  const [csvMissing, setCsvMissing] = useState(false);
  const [selectChange, setSelectChange] = useState("");


  useEffect(() => {
    fileNameUpdate();
  }, [fileName])

  useEffect(() => {
    setActive(1);
    setTeamData(backupData);
    document.addEventListener('mousedown', handleselectorOutside);
    return () => {
      document.removeEventListener('mousedown', handleselectorOutside);
    };
  }, [])

  function fileNameUpdate() {
    fileName ? setTempFileName(fileName) : setTempFileName("My Team");
  }

  function dropdownVisible() {
    setCsvMissing(false);
    if (dropdown) {
      setFile(null);
      setData([]);
      setTeamLen(null);
    }
    setDropdown(!dropdown);
  }

  function closeAction() {
    setActionDropdown(null);
  }

  function handleLabelClick() {
    fileInputRef.current.click();
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = function (e) {
        const contents = e.target.result;
        parseCSV(contents);
      };
      reader.readAsText(selectedFile);
    }
  }

  const parseCSV = (data) => {
    const rows = [];
    const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
    let hasEmptyValue = false;
    setCsvMissing(false);
    data.split('\n').forEach(row => {
      if (!row.match(/,,/)) {
        const matches = row.match(regex);
        if (matches) {
          const cleanedRow = matches.map(item => item.replace(/^"|"$/g, '').trim());
          rows.push(cleanedRow);
        }
      }
      else {
        hasEmptyValue = true;
      }
    });
    if (!hasEmptyValue) {
      setData(rows);
      orgData(rows);
    }
    else {
      setData([]);
      setTeamLen(null);
      setCsvMissing(true);
    }
  }

  function orgData(rows) {
    let counts = {};
    rows?.map((row) => {
      counts[row[3]] ? counts[row[3]] += 1 : counts[row[3]] = 1;
    })
    setTeamLen(counts);
  }

  function importedAllData() {
    let filterData = data.slice(1);
    const selector = {
      position: [],
      country: []
    };
    filterData?.map((dt) => {
      !selector.position.includes(dt[3]) ? selector.position.push(dt[3]) : "";
      !selector.country.includes(dt[6]) ? selector.country.push(dt[6]) : "";
    })
    setSelectFieldData(selector);
    setTeamData(filterData);
    setBackupData(filterData);
    setFileName(file.name);
    dropdownVisible();
    Swal.fire({
      title: "Done!",
      text: "CSV file Selected.",
      icon: "success",
    });
  }

  function deletePlayer(jersyNo) {
    setActionDropdown(null);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let filterData = teamData?.filter((dt) => dt[2] !== jersyNo);
        setTeamData(filterData);
        setBackupData(filterData);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  function editDropdown(jersyNo) {
    setActionEdit(jersyNo);
    closeAction();
  }

  function editedTeamData(event) {
    setEditData(true);
    const { name, value } = event.target;
    const newInputValue = [...inputValue];
    name === "playerName" ? newInputValue[0] = value
      : name === "jersyNo" ? newInputValue[2] = value
        : name === "height" ? newInputValue[4] = value
          : name === "width" ? newInputValue[5] = value
            : name === "nationality" ? newInputValue[6] = value
              : name === "position" ? newInputValue[3] = value
                : name === "starter" ? newInputValue[8] = value
                  : "";
    setInputValue(newInputValue);
  }

  function editTeamData(jersyNo) {
    setActionEdit(null);
    let filterData = [...teamData];
    filterData = filterData?.map((dt, index) => {
      if (dt[2] == jersyNo) {
        return inputValue;
      }
      return dt;
    });
    setTeamData(filterData);
    setBackupData(filterData);
    Swal.fire({
      title: "Edited!",
      text: "Your data has been Edited.",
      icon: "success"
    });
  }

  function searchPlayer() {
    setTeamData(teamData?.filter((item) => {
      return item[0].toLowerCase().includes(searching.toLowerCase());
    }))
    setSearchActive(true);
  }

  function searchClose() {
    setSearchActive(false);
    setTeamData(backupData);
    setSearching("");
  }

  function editHeading(flag) {
    setHeadingActive(false);
    if (flag) {
      setFileName(tempFileName);
      setHeadingEdited(true);
      Swal.fire({
        title: "Done!",
        text: "File name has been Edited.",
        icon: "success"
      });
    }
    else {
      fileNameUpdate();
    }
  }

  function editSelectorClicked(pos) {
    if (selectChange != pos) {
      setSelectChange(pos);
    }
    else {
      setSelectChange("");
    }
  }

  function handleselectorOutside(event) {
    if (selectorRef1.current && selectorRef2.current && !selectorRef1.current.contains(event.target) && !selectorRef2.current.contains(event.target)) {
      setSelectChange("");
    }
  }

  return (
    <div className='team-view'>
      <div className='team-content-top'>
        <div className='team-nav'>
          {
            !headingActive ?
              <div className='nav-name'>
                <div className='nav-name-heading'>Roster Details</div>
                <div className='nav-name-edit'>
                  <div className='edit-txt' onClick={() => setHeadingActive(true)}>{teamData.length ? fileName : tempFileName}</div>
                  <div className='nav-edit-icon'><EditIcon className={`edit-icon ${headingEdited ? "csv-h-edited" : ""}`} onClick={() => setHeadingActive(true)} /></div>
                </div>
              </div>
              :
              <div className='edit-csv-heading-div'>
                <div className='nav-edit-icon'><EditIcon className='edit-icon edit-icon-head-active' /></div>
                <input type='text' className='edit-csv-heading' value={tempFileName} onChange={(e) => setTempFileName(e.target.value)} />
                <div className='search-close'><CloseIcon className='act-cls-btn edit-head-icon' onClick={() => editHeading(0)} /></div>
                <div className='search-close'><CheckIcon className='act-cls-btn edit-head-icon' onClick={() => editHeading(1)} /></div>
              </div>
          }
          <div className='nav-import'>
            <div className='search-bar'>
              <div className='search-bar-icon'>{!searchActive ? <SearchIcon className='search-icon' /> : ""}</div>
              <div className='input-field'><input type='text' placeholder='Find Player' className='search-inpt' value={searching} onChange={(e) => setSearching(e.target.value)} disabled={searchActive} /></div>
              <div className='search-btn-top'>
                {searching && !searchActive ? <div className='search-btn' onClick={searchPlayer}>Search</div> : searchActive ? <div className='search-close'><CloseIcon className='act-cls-btn' onClick={searchClose} /></div> : <div className='no-btn'></div>}
              </div>
            </div>
            <div className='import-btn-top'>
              <button className={`import-btn ${teamData.length ? "re-import" : "re-import-dis"}`} onClick={dropdownVisible}>{teamData.length ? "Re-Import Team" : "Import Team"}</button>
              {
                dropdown && (
                  <>
                    <div className='backdrop'></div>
                    <div className='dropdown-content'>
                      <div className='dropdown-main'>
                        <div className='dropdown-heading'>
                          <div className='dropdown-head'>
                            <div className='dropdown-head-txt'>Importer</div>
                            <div className='dropdown-cross' onClick={dropdownVisible}><CloseIcon className='close' /></div>
                          </div>
                          <div className='dropdown-hr'><hr /></div>
                        </div>
                        <div className='dropdown-content-data'>
                          <div className='csv-import'>
                            <div className='imp-heading'>Roster File</div>
                            <div className='imp-box'>
                              <div className='imp-box-child1'>
                                <div htmlFor="csvFile" onClick={handleLabelClick} className={`inp-lable ${csvMissing ? "csv-d-m" : ""}`} >
                                  <div className='slt-txt'>{file?.name ? file.name : "No Files Selected"}</div>
                                  <div className={`slt-btn ${csvMissing ? "csv-d-m" : ""}`}>Select File</div>
                                </div>
                                <input type="file" name="csvFile" id="csvFile" className='csvFile' ref={fileInputRef} onChange={handleFileChange} accept=".csv" />
                              </div>
                              {
                                csvMissing ?
                                  <div className='error-csv'>
                                    <div className='csv-e'>Error</div>
                                    <div className='csv-e-t'>Your sheet is missing data. Please ensure all cells filled out.</div>
                                  </div>
                                  :
                                  <div className='imp-box-child2'>File must be in .csv format</div>
                              }
                            </div>
                          </div>
                          {!csvMissing && (
                            <div className='import-value-count'>
                              <div className='count-heading'>File Summary</div>
                              <div className='count-table'>
                                <table className='count-table-view'>
                                  <tbody>
                                    <tr className='heading'>
                                      <td>Total Players</td>
                                      <td>Goalkeepers</td>
                                      <td>Defenders</td>
                                      <td>Midfielders</td>
                                      <td>Forwards</td>
                                    </tr>
                                    <tr className='count-table-data'>
                                      <td>{data.length ? data?.length - 1 : "0"}</td>
                                      <td>{teamLen ? teamLen?.Goalkeeper : "0"}</td>
                                      <td>{teamLen ? teamLen?.Defender : "0"}</td>
                                      <td>{teamLen ? teamLen?.Midfielder : "0"}</td>
                                      <td>{teamLen ? teamLen?.Forward : "0"}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )
                          }
                          <div className='import-team-data'>
                            <div className='import-team-data-child'>
                              <button type='button' className={`imp-t-btn ${data.length ? "active-imp-btn" : ""}`} onClick={importedAllData} disabled={!data.length}>Import</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              }
            </div>
          </div>
        </div>
        <div className='team-content'>
          {
            teamData.length != 0 ? (
              <table className='table-view'>
                <tbody>
                  <tr className='heading'>
                    <td>Player Name</td>
                    <td>Jersey Number</td>
                    <td>Starter</td>
                    <td>Positon</td>
                    <td>Height</td>
                    <td>Weight</td>
                    <td>Nationility</td>
                    <td>Appearances</td>
                    <td>Minutes Played</td>
                  </tr>
                  {
                    teamData?.map((tdata, index) => (
                      <tr className='team-list-data' key={tdata[2]}>
                        <td>
                          <div className='img-name'>
                            <div className='ply-img-div'><img src={tdata[7]} className='ply-img' /></div>
                            <div className='ply-name-div'>
                              <div className='ply-name'>{tdata[0]}</div>
                            </div>
                          </div>
                        </td>
                        <td>{tdata[2]}</td>
                        <td>{tdata[8]}</td>
                        <td>{tdata[3]}</td>
                        <td>{tdata[4]}</td>
                        <td>{tdata[5]}</td>
                        <td>{tdata[6]}</td>
                        <td>{tdata[9]}</td>
                        <td>{tdata[10]}</td>
                        <td>
                          <div className='more'>
                            <MoreHorizIcon className='more-icon' onClick={() => setActionDropdown(tdata[2])} />
                            {
                              actionDropdown === tdata[2] && (
                                <div className='action-dd'>
                                  <div className='nav-action'>
                                    <div className='action-head'>Actions</div>
                                    <div className='action-close'><CloseIcon className='act-cls-btn' onClick={closeAction} /></div>
                                  </div>
                                  <div className='actions'>
                                    <div className='actions-edit' onClick={() => { editDropdown(tdata[2]); setInputValue(tdata); }}>
                                      <div className='action-edit-div'><EditIcon className='action-edit' /></div>
                                      <div className='edit-txt-div'>Edit Player</div>
                                    </div>
                                    <div className='actions-del' onClick={() => deletePlayer(tdata[2])}>
                                      <div className='action-del-div'><DeleteIcon className='action-del' /></div>
                                      <div className='del-txt-div'>Delete Player</div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            {
                              actionEdit === tdata[2] && (
                                <>
                                  <div className='backdrop edit-backdrop'></div>
                                  <div className='action-edit-pop'>
                                    <div className='edit-heading'>
                                      <div className='edit-text'>Edit Player</div>
                                      <div className='action-close'><CloseIcon className='act-cls-btn' onClick={() => { setActionEdit(null); setEditData(false); }} /></div>
                                    </div>
                                    <div className='edit-team-data'>
                                      <div className='edit-main-div'>
                                        <div className='inp-div' style={{ width: "61%" }}>
                                          <div className='inp-txt'>Player Name</div>
                                          <input type='text' name="playerName" className='inp-edit' onChange={(e) => editedTeamData(e)} value={inputValue[0]} />
                                        </div>
                                        <div className='inp-div' style={{ width: "35%", marginLeft: "4%" }}>
                                          <div className='inp-txt'>Jersey Number</div>
                                          <input type='text' name="jersyNo" className='inp-edit' onChange={(e) => editedTeamData(e)} value={inputValue[2]} />
                                        </div>
                                        <div className='inp-div' style={{ width: "48%" }}>
                                          <div className='inp-txt'>Height</div>
                                          <input type='text' name="height" className='inp-edit' onChange={(e) => editedTeamData(e)} value={inputValue[4]} />
                                        </div>
                                        <div className='inp-div' style={{ width: "48%", marginLeft: "4%" }}>
                                          <div className='inp-txt'>Weight</div>
                                          <input type='text' name="width" className='inp-edit' onChange={(e) => editedTeamData(e)} value={inputValue[5]} />
                                        </div>
                                        <div className='inp-div' style={{ width: "100%" }}>
                                          <div className='inp-txt'>Nationality</div>
                                          <div style={{ position: 'relative' }} ref={selectorRef1}>
                                            <div className='inp-edit inp-select' onClick={() => editSelectorClicked("nationality")}>
                                              {inputValue[6]}
                                              <span>
                                                {selectChange == "nationality" ? <KeyboardArrowDownIcon className='t-s-a-b' /> : <KeyboardArrowRightIcon className='t-s-a-b' />}
                                              </span>
                                            </div>
                                            {selectChange == "nationality" && (
                                              <div className='options-list'>
                                                {selectFieldData.country?.map((pos) => (
                                                  <input key={pos} type="button" name="nationality" className='option' value={pos} onClick={(e) => {editedTeamData(e);editSelectorClicked("nationality")}} />
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className='inp-div' style={{ width: "100%" }}>
                                          <div className='inp-txt'>Position</div>
                                          <div style={{ position: 'relative' }} ref={selectorRef2}>
                                            <div className='inp-edit inp-select' onClick={() => editSelectorClicked("position")}>
                                              {inputValue[3]}
                                              <span>
                                                {selectChange == "position" ? <KeyboardArrowDownIcon className='t-s-a-b' /> : <KeyboardArrowRightIcon className='t-s-a-b' />}
                                              </span>
                                            </div>
                                            {selectChange == "position" && (
                                              <div className='options-list'>
                                                {selectFieldData.position?.map((pos) => (
                                                  <input key={pos} type="button" name="position" className='option' value={pos} onClick={(e) => {editedTeamData(e);editSelectorClicked("position")}} />
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className='inp-div' style={{ width: "100%" }}>
                                          <div className='inp-txt'>Starter</div>
                                          <div className='edit-select-box'>
                                            <div className='slt-yes'>
                                              <input type="radio" id='yes' name='starter' value="Yes" onChange={(e) => editedTeamData(e)} checked={inputValue[8] === "Yes"} />
                                              <label htmlFor="yes" className='lab-r'>Yes</label>
                                            </div>
                                            <div className='slt-no'>
                                              <input type="radio" id="no" name='starter' value="No" onChange={(e) => editedTeamData(e)} checked={inputValue[8] === "No"} />
                                              <label htmlFor="no" className='lab-r'>No</label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className='edit-btn-top'>
                                          <button type='submit' className={`edit-submit-btn ${editData ? "active-imp-btn" : ""}`} onClick={() => editTeamData(tdata[2])} disabled={!editData}>Edit Player</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                            }
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            ) : (
              <div className='table-heading-top'>
                <div className='table-heading'>
                  <div className='tbl-data'>Player Name</div>
                  <div className='tbl-data'>Jersey Number</div>
                  <div className='tbl-data'>Positon</div>
                  <div className='tbl-data'>Height</div>
                  <div className='tbl-data'>Weight</div>
                  <div className='tbl-data'>Nationility</div>
                </div>
                <div className='empty-txt'>
                  <div className="error-txt">
                    <div className='txt-child1'>You do not have any players on the roster</div>
                    <div className='txt-child2'>Import Team</div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div >
    </div >
  )
}

export default Team