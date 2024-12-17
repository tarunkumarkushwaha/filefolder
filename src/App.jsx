import './App.css'
import Folder from './components/Folder'
import { folderData } from '../FolderData/data'
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const App = () => {
  const [selected, setSelected] = useState("root");
  const [Name, setName] = useState("");
  const [openeditname, setopeneditname] = useState(false);
  const [folderTree, setFolderTree] = useState(folderData);
  const ref = useRef(null);

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

  function renameInData(selectedValue, newName) {
    const updatedFolderTree = renameInFolderTree(folderTree, selectedValue, newName);
    console.log(updatedFolderTree)
    setFolderTree(updatedFolderTree);
    setopeneditname(false);
    toast.success(`${typeof selectedValue == "string" ? selectedValue : ""} renamed to ${newName}`)
  }

  console.log(selected,Name,"select,name")

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setSelected("root");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <h2 className='p-10 text-center font-serif bg-slate-900 text-slate-200 font-bold min-h-[15vh]: text-xl'>Tarun File Manager</h2>
      <div
        className='p-16 flex w-full justify-center bg-slate-300 min-h-[85vh] items-center'>
        <Folder
          ref={ref}
          folderTree={folderTree}
          setFolderTree={setFolderTree}
          Name={Name}
          setName={setName}
          renameInData={renameInData}
          openeditname={openeditname}
          setopeneditname={setopeneditname}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </>
  );
};

export default App;

