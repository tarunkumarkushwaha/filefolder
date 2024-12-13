import './App.css'
import Folder from './components/Folder'
import { folderData } from '../FolderData/data'
import { useEffect, useRef, useState } from 'react';

const App = () => {
  const [selected, setSelected] = useState(folderData);
  const [folderTree, setFolderTree] = useState(folderData);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setSelected(folderData);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  console.log(selected)
  return (
    <>
      <h2 className='p-10 text-center font-serif font-bold text-xl'>Tarun File Viewer</h2>
      <div
        // onClick={(e)=>{
        //   setSelected(e.target.innerText)}} 
        className='p-16 flex w-full justify-center  items-center'>
        <Folder
          ref={ref}
          folderTree={folderTree}
          setFolderTree={setFolderTree}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      {/* <div ref={ref}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, suscipit. Consequuntur temporibus nobis nihil inventore maxime! Dolore, neque soluta nihil voluptates illum perspiciatis optio voluptate voluptatibus odio cupiditate ipsum at possimus dolorum magni mollitia officiis deserunt consequatur sequi vel ad delectus itaque commodi. Nemo molestiae, nisi consequuntur ad magnam fugiat.
        {isClickedOutside && <p>Clicked outside!</p>}
      </div> */}
    </>
  );
};

export default App;

