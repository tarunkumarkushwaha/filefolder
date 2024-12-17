import React, { useState, useEffect } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImageIcon from "@mui/icons-material/Image";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import JavascriptIcon from "@mui/icons-material/Javascript";
import ListIcon from "@mui/icons-material/List";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { folderData } from '../../FolderData/data';
import { toast } from 'react-toastify';
import EditableDiv from './EditableDiv';

const Folder = React.forwardRef((props, ref) => {
    const { folderTree, setFolderTree, selected, setSelected, level = 0 } = props
    const [collapsed, setCollapsed] = useState({});
    const [Name, setName] = useState("");
    const [openSetFile, setopenSetFile] = useState(false);
    const [openSetFolder, setopenSetFolder] = useState(false);

    const icons = {
        image: <ImageIcon className="text-blue-500 text-sm mx-2" />,
        video: <OndemandVideoIcon className="text-orange-500 text-sm mx-2" />,
        audio: <AudiotrackIcon className="text-red-500 text-sm mx-2" />,
        exe: <SettingsSuggestIcon className="text-black text-sm mx-2" />,
        js: <JavascriptIcon className="text-yellow-500 text-sm mx-2" />,
        txt: <TextFieldsIcon className="text-yellow-100 text-sm mx-2" />,
        others: <ListIcon className="text-gray-500 text-sm mx-2" />,
        dmg: <ListIcon className="text-gray-500 text-sm mx-2" />,
    };

    const fileExtensionsMap = {
        jpg: "image",
        png: "image",
        mp4: "video",
        mpg: "video",
        mp3: "audio",
        exe: "exe",
        dmg: "dmg",
        js: "js",
        txt: "txt",
    };

    const getFileTypeIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        const type = fileExtensionsMap[ext] || "others";
        return icons[type];
    };

    const deleteItem = (deleteTarget) => {
        const updatedData = folderTree.map((folder) => {
            const updatedFolder = {};

            for (const [key, value] of Object.entries(folder)) {
                if (key.toLowerCase() === deleteTarget.toLowerCase()) {
                }
                if (Array.isArray(value)) {
                    const filteredValues = value.map((item) => {
                        if (typeof item === "string") {
                            return item.toLowerCase() === deleteTarget.toLowerCase() ? null : item;
                        } else if (typeof item === "object") {
                            const nestedKey = Object.keys(item)[0];
                            const nestedValue = item[nestedKey].filter(
                                (nestedItem) => nestedItem.toLowerCase() !== deleteTarget.toLowerCase()
                            );
                            return nestedValue.length ? { [nestedKey]: nestedValue } : null;
                        }
                        return item;
                    }).filter(Boolean);

                    updatedFolder[key] = filteredValues;
                } else {
                    updatedFolder[key] = value;
                }
            }
            return Object.keys(updatedFolder).length ? updatedFolder : null;
        }).filter(Boolean);
        toast.success(`${deleteTarget} deleted`)
        setFolderTree(updatedData);
    };

    function addValueToArray(selectedKey, newValue) {
        // Basic validation for input file name
        if (!newValue || typeof newValue !== "string") {
          alert("Invalid file name");
          return;
        }
      
        const extension = newValue.split(".").pop();
      
        if (newValue.includes("..")) {
          alert("Double dots are not allowed");
          return;
        } else if (!(extension in fileExtensionsMap)) {
          alert("File not supported");
          return;
        }
      
        setFolderTree((prevData) => {
          const updatedData = JSON.parse(JSON.stringify(prevData));

          if (selectedKey === folderTree) {
            updatedData.push(newValue);
            return updatedData;
          }

          const addToMatchingKey = (data) => {
            if (Array.isArray(data)) {
           
              return data.map((item) => {
                if (typeof item === "object" && item !== null) {
           
                  if (item === selectedKey) {
                 
                    if (!Array.isArray(item.files)) {
                      item.files = [];
                    }
                    item.files.push(newValue);
                  }
                  return addToMatchingKey(item);
                }
                return item;
              });
            } else if (typeof data === "object" && data !== null) {
            
              for (const key in data) {
                if (key === selectedKey && Array.isArray(data[key])) {
               
                  data[key].push(newValue);
                } else if (data[key] === selectedKey) {
            
                  if (!Array.isArray(data.files)) {
                    data.files = [];
                  }
                  data.files.push(newValue);
                } else {
             
                  addToMatchingKey(data[key]);
                }
              }
            }
            return data;
          };
      
          return addToMatchingKey(updatedData);
        });
      }
      
      

    const renameInFolderTree = (data, selectedValue, newName) => {
       
        if (Array.isArray(data)) {
          return data.map(item => renameInFolderTree(item, selectedValue, newName));
        }
    
        if (typeof data === 'object' && data !== null) {
          const newObject = {};
          for (const [key, value] of Object.entries(data)) {
          
            const newKey = (key === selectedValue) ? newName : key;
    
            newObject[newKey] = renameInFolderTree(value, selectedValue, newName);
          }
          return newObject;
        }
    
        return data === selectedValue ? newName : data;
      };
    
    
      const renameInData = (selectedValue, newName) => {
        const updatedFolderTree = renameInFolderTree(folderTree, selectedValue, newName);
        setFolderTree(updatedFolderTree);
        toast.success(`${selectedValue} is renamed to ${newName}`)
      };
    

    function addFolder(parentFolderName, newFolderName) {
        const updatedData = folderTree.map((folder) => {
            const updatedFolder = {};

            for (const [key, value] of Object.entries(folder)) {
                if (key.toLowerCase() === parentFolderName.toLowerCase()) {
                    if (Array.isArray(value)) {
                        const folderExists = value.some(
                            (item) => typeof item === "object" && Object.keys(item)[0] === newFolderName
                        );

                        if (!folderExists) {
                            value.push({ [newFolderName]: [] });
                        }
                    }
                }
                updatedFolder[key] = value;
            }

            return updatedFolder;
        });

        setFolderTree(updatedData);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (openSetFile) {
                addValueToArray(selected, Name)
                setopenSetFile(false)
            }
            else { addFolder(selected, Name); 
                setopenSetFolder(false)
             }
        }
    };


    useEffect(() => {
        const initializeCollapsed = (data, parentKey = '') => {
            const newState = {};
            if (Array.isArray(data)) {
                data.forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        const key = `${parentKey}-${index}`;
                        newState[key] = true;
                        Object.assign(newState, initializeCollapsed(item, key));
                    }
                });
            } else if (typeof data === 'object' && data !== null) {
                Object.keys(data).forEach((key) => {
                    const currentKey = parentKey ? `${parentKey}.${key}` : key;
                    newState[currentKey] = true;
                    Object.assign(newState, initializeCollapsed(data[key], currentKey));
                });
            }
            return newState;
        };

        setCollapsed(initializeCollapsed(folderTree));
    }, [folderTree]);

    const toggleCollapse = (currentkey, key) => {
        setCollapsed((prevState) => ({
            ...prevState,
            [currentkey]: !prevState[currentkey],
        }));
        setSelected(key);
    };

    const renderData = (data, parentKey = '', currentLevel = 0) => {
        if (Array.isArray(data)) {
            return data.map((item, index) => (
                <div key={`${parentKey}-${index}`} style={{ marginLeft: `${currentLevel * 10}px` }}>
                    {renderData(item, `${parentKey}-${index}`, currentLevel + 1)}
                </div>
            ));
        }

        if (typeof data === 'object' && data !== null) {
            return Object.entries(data).map(([key, value]) => {
                const currentKey = parentKey ? `${parentKey}.${key}` : key;
                return (
                    <div key={currentKey} style={{ marginLeft: `${currentLevel * 10}px` }}>
                        <span
                            className={`cursor-pointer font-bold flex items-center border p-2 ${selected == key ? " border-slate-600 rounded-md" : " border-slate-900 rounded-md"}`}
                            onClick={() => toggleCollapse(currentKey, key)}
                        >
                            <span
                                className={`mx-2 transform transition-transform duration-100 ${collapsed[currentKey] ? '' : 'rotate-90'
                                    }`}
                            >
                                <ArrowForwardIosIcon fontSize='small' />
                            </span>
                            <EditableDiv data={key} selected={selected} deleteItem={deleteItem} renameInData={renameInData} />
            
                        </span>

                        {!collapsed[currentKey] && (
                            <div>{renderData(value, currentKey, currentLevel + 1)}
                                {(openSetFile || openSetFolder) && <input type="text"
                                    style={{ marginLeft: `${currentLevel * 20}px` }}
                                    placeholder='enter file name'
                                    className=' focus:outline-none p-1 rounded-md border bg-slate-900 border-slate-700 text-slate-400'
                                    onKeyDown={handleKeyPress}
                                    onChange={(e) => setName(e.target.value)} />}
                            </div>
                        )}
                    </div>
                );
            });
        }

        return (
            <div onClick={() => setSelected(data)} className={`flex items-center p-1 cursor-pointer ${selected == data ? "border border-slate-600 rounded-md" : "border border-slate-900 rounded-md"}`} style={{ marginLeft: `${currentLevel * 10}px` }}>
                {typeof data === "string" && getFileTypeIcon(data)}
                <EditableDiv data={data} selected={selected} deleteItem={deleteItem} renameInData={renameInData} />
            </div>
        );
    };

    return (
        <div className="w-1/2 bg-slate-900 border border-slate-200 text-slate-400 rounded-md p-5" ref={ref}>
            <div className="flex justify-end pb-3">
                <div title='add folder' className='cursor-pointer px-2' onClick={() => setopenSetFolder(!openSetFolder)}><CreateNewFolderIcon /></div>
                <div title='add file' className='cursor-pointer px-2' onClick={() => setopenSetFile(!openSetFile)}><NoteAddIcon /></div>
            </div>
            {renderData(folderTree, '', level)}
            {(openSetFile || openSetFolder) && selected == folderData && <input type="text"
                className=' focus:outline-none border bg-slate-900 border-slate-700 text-slate-400 p-1 rounded-md ml-12'
                onKeyDown={handleKeyPress}
                placeholder={`enter name`}
                onChange={(e) => setName(e.target.value)} />}
        </div>
    );
});

export default Folder;