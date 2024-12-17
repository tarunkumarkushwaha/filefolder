import React, { useState, useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const EditableDiv = ({ data, selected, deleteItem, renameInData }) => {
    const [text, setText] = useState( data );
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);

    const handleEditClick = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setIsEditing(false);
            renameInData(selected, text)
        }
    };

    return (
        <>
            {typeof data == "string" ?
                <div className="flex items-center justify-between w-full">
                    <div className="relative w-full">
                        {!isEditing ? (
                            <div className="absolute -top-4">
                                {text}
                            </div>
                        ) : (

                            <input
                                ref={inputRef}
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                className="absolute -top-4 focus:outline-none bg-slate-900 text-slate-400"
                            />
                        )}
                    </div>

                    <>
                        {selected == text && <div className='flex justify-end w-full'>
                            <div title='delete' className='cursor-pointer px-2' onClick={() => deleteItem(selected)}><DeleteIcon /></div>
                            <div title='modify' className='cursor-pointer px-2' onClick={handleEditClick}><EditIcon /></div>
                        </div>}
                    </>
                </div>
                :
                { data }
            }
        </>
    );
};

export default EditableDiv;

