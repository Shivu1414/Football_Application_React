import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

function Field({ headingEdited, setHeadingEdited, backupData, setActive, fileName, setFileName }) {
  const [tempFileName, setTempFileName] = useState("");
  const [headingActive, setHeadingActive] = useState(false);
  const [suffPlayer, setSuffPlayer] = useState(false);
  const [runningPlayer, setRunningPlayer] = useState();
  const [playerView, setPlayerView] = useState();

  useEffect(() => {
    setActive(2);
    fileNameUpdate();
    checkActivePlayer();
  }, [])

  function fileNameUpdate() {
    fileName ? setTempFileName(fileName) : setTempFileName("My Team");
  }

  function checkActivePlayer() {
    let activePlayer = {
      Goalkeeper: [],
      Defender: [],
      Midfielder: [],
      Forward: []
    };
    const maxPlayers = {
      Goalkeeper: 1,
      Defender: 4,
      Midfielder: 3,
      Forward: 3
    };
    backupData?.map((dt) => {
      const position = dt[3];
      if (position in activePlayer && dt[8] === "Yes") {
        if (activePlayer[position].length < maxPlayers[position]) {
          activePlayer[position].push(dt);
        }
      }
    })
    if (activePlayer.Goalkeeper.length > 0 && activePlayer.Defender.length > 3 && activePlayer.Midfielder.length > 2 && activePlayer.Forward.length > 2) {
      setSuffPlayer(true);
      highlightPlayer(activePlayer.Goalkeeper[0][2]);
    }
    else {
      setSuffPlayer(false);
    }
    setRunningPlayer(activePlayer);
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

  function highlightPlayer(jersyNo) {
    backupData?.map((item) => {
      if (item[2] == jersyNo) {
        setPlayerView(item);
      }
    })
  }

  return (
    <div className='field-background'>
      <div className='f-p-empty-pop'>
        {
          backupData.length == 0 ?
            <div className='f-data-empty'>
              <div className='f-d-e-child1-top'>
                <div className='f-d-e-child11'><WarningRoundedIcon className='f-p-e-warning' /></div>
                <div className='f-d-e-child12'>No player data found</div>
              </div>
              <div className='f-d-e-child2'>please import your roaster first</div>
            </div>
            :
            !suffPlayer && (
              <div className='f-n-suffPyr'>
                <div className='f-d-e-child1-top'>
                  <div className='f-d-e-child11'><WarningRoundedIcon className='f-p-e-warning' /></div>
                  <div className='f-d-e-child12'>Not enough starters</div>
                </div>
                <div className='f-d-e-child2'>Your team doesn't have enough starters for one or more of the positions in the 4-3-3 formation</div>
              </div>
            )
        }
      </div>
      <div className='f-nav'>
        {!headingActive ?
          <div className='field-heading'>
            <div className='f-h-child1'>Formation Overview</div>
            <div className='f-h-child2'>
              <div className='f-h-child21' onClick={() => setHeadingActive(true)}>{tempFileName}</div>
              <div className='f-h-child22'>{<EditIcon className={`f-edit-icon ${headingEdited ? "csv-h-edited" : ""}`} onClick={() => setHeadingActive(true)} />}</div>
            </div>
          </div>
          :
          <div className='edit-csv-heading-div f-nav-edit'>
            <div className='nav-edit-icon'><EditIcon className='edit-icon edit-icon-head-active' /></div>
            <input type='text' className='edit-csv-heading' value={tempFileName} onChange={(e) => setTempFileName(e.target.value)} />
            <div className='search-close'><CloseIcon className='act-cls-btn edit-head-icon' onClick={() => editHeading(0)} /></div>
            <div className='search-close'><CheckIcon className='act-cls-btn edit-head-icon' onClick={() => editHeading(1)} /></div>
          </div>
        }
      </div>
      <div className='field-structure'>
        <div className='football-field'>
          {
            suffPlayer == true && (
              <div className='player-pin-cirle'>
                <div className='f-p-glk'>
                  {
                    runningPlayer.Goalkeeper?.map((dt, index) => (
                      <div className='f-p-top'>
                        <div className={`f-p f-c-golskeeper ${playerView[2] == dt[2] ? "f-bg-change" : ""}`} onClick={() => highlightPlayer(dt[2])}>
                          <div className='num'>{index + 1}</div>
                        </div>
                        <div className='run-name'>{dt[0]}</div>
                      </div>
                    ))
                  }
                </div>
                <div className='f-p-dfnr'>
                  {
                    runningPlayer.Defender?.map((dt, index) => (
                      <div className='f-p-top' key={dt[2]}>
                        <div className={`f-p f-c-defender ${playerView[2] == dt[2] ? "f-bg-change" : ""}`} onClick={() => highlightPlayer(dt[2])}>
                          <div className='num'>{index + 2}</div>
                        </div>
                        <div className='run-name'>{dt[0]}</div>
                      </div>
                    ))
                  }
                </div>
                <div className='f-p-mdf'>
                  {
                    runningPlayer.Midfielder?.map((dt, index) => (
                      <div className='f-p-top' key={dt[2]}>
                        <div className={`f-p f-c-midfielder ${playerView[2] == dt[2] ? "f-bg-change" : ""}`} onClick={() => highlightPlayer(dt[2])}>
                          <div className='num'>{index + 6}</div>
                        </div>
                        <div className='run-name'>{dt[0]}</div>
                      </div>
                    ))
                  }
                </div>
                <div className='f-p-frwd'>
                  {
                    runningPlayer.Forward?.map((dt, index) => (
                      <div className='f-p-top' key={dt[2]}>
                        <div className={`f-p f-c-forward ${playerView[2] == dt[2] ? "f-bg-change" : ""}`} onClick={() => highlightPlayer(dt[2])}>
                          <div className='num'>{index + 9}</div>
                        </div>
                        <div className='run-name'>{dt[0]}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          }
        </div>
        {
          (suffPlayer && playerView) ?
            <div className='f-player-view'>
              <div className='f-p-child1'>
                <div className='f-p-image'>
                  <div className='f-p-j-n-b'>{playerView[2]}</div>
                  <div className='f-p-j-n-s'>{playerView[2]}</div>
                  <img src={playerView[1]} className='f-player-pic' alt="Player View" onError={(e) => { e.target.onerror = null; e.target.src = '/player.png'; }} />
                  <div className='f-p-v-n'>
                    <div className='f-p-name'>{playerView[0]}</div>
                    <div className='f-p-pos'>{playerView[3]}</div>
                  </div>
                </div>
                <div className='f-p-details'>
                  <div className=''>
                    <div className='f-d-i-h'>Height</div>
                    <div className=''>{playerView[4]} m</div>
                  </div>
                  <div className=''>
                    <div className='f-d-i-h'>Weight</div>
                    <div className=''>{playerView[5]} kg</div>
                  </div>
                  <div className=''>
                    <div className='f-d-i-h'>Nationality</div>
                    <div className='f-p-v-det'>
                      <div className=''><img src={playerView[7]} className='f-c-i-view' /></div>
                      <div className=''>{playerView[6]}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='f-hr'></div>
              <div className='f-p-child2'>
                <div className='f-p-child21'>
                  <div className='bottom-data'>
                    <div className='det-num'>{playerView[9]}</div>
                    <div className='det-name'>Appearances</div>
                  </div>
                  <div className='bottom-data'>
                    <div className='det-num'>{playerView[13] == "N/A" ? playerView[11] : playerView[13]}</div>
                    <div className='det-name'>{playerView[13] == "N/A" ? "Assists" : "Clean sheets"}</div>
                  </div>
                </div>
                <div className='f-p-child22'>
                  <div className='bottom-data'>
                    <div className='det-num'>{playerView[10]}</div>
                    <div className='det-name'>Minutes Played</div>
                  </div>
                  <div className='bottom-data'>
                    <div className='det-num'>{playerView[14] == "N/A" ? playerView[12] : playerView[14]}</div>
                    <div className='det-name'>{playerView[14] == "N/A" ? "Goals" : "Saves"}</div>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className='f-player-view'>
              <div className='f-p-child1'></div>
              <div className='f-hr'></div>
              <div className='f-p-child2'></div>
            </div>
        }
      </div>
    </div>
  )

}
export default Field