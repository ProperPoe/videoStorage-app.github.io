import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Props {
    setShowEdit: any
}

function EditProfile(props: Props) {
    const {setShowEdit} = props
    
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode)

    const handleShow = () => {
        setShowEdit(false)
    }
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} bg-opacity-80`} onClick={handleShow}>
        <div className={`w-96 p-8 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <h2 className="text-2xl font-semibold mb-4">Upload New Post</h2>
        <form className="space-y-4" >
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className={`mt-1 p-3 w-full border rounded-md focus:ring focus:ring-blue-300 ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
              }`}
              //value={desc}
              //onChange={(e)=>setDesc(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Upload Post
          </button>
        </form>
        </div>
        
      </div>   
    )
}

export default EditProfile
