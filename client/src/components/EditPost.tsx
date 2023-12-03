import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { makeRequest } from '../axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FavoriteBorderOutlined, Edit, Delete, Lock, CloudDownload, ChatBubbleOutline, Favorite, Close } from '@mui/icons-material';


type UpdateDescFunction = (newDesc: string) => void;

interface Props {
  setShowEdit: (showEdit: boolean) => void;
  postId: number;
  desc: string;
  updateDesc: (newDesc: string) => void;
}

function EditPost(props: Props) {
    const {setShowEdit, postId, desc, updateDesc} = props
    //state for edit
    const [editDesc, setEditDesc] = useState(desc)
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode)

    const queryClient = useQueryClient();

    const editPostMutation = useMutation(
      (newDesc: string) => {
        return makeRequest.put(`/posts/${postId}`, { desc: newDesc }); 
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['posts', postId]);
        },
      }
    );

    const handleShow = () => {
        setShowEdit(false)
    }
    
    const handleEditPost = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // editPostMutation with the new desc
      await editPostMutation.mutateAsync(editDesc);

      // console.log('Edit Post Mutation Completed')

      // const updatedPostResponse = await makeRequest.get(`/posts?postId=${postId}`);
      // const updatedPost = updatedPostResponse.data;
    
      // console.log('Updated Post Data:', updatedPost); // Add a log to check the updated post data

      // update desc in ViewPost with the updated data
      updateDesc(editDesc);
    
      console.log('Description Updated');

      handleShow();
    }

    // useEffect(() => {
    //   setEditDesc(desc);
    // }, [desc]);
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} bg-opacity-80`}>
        <div className={`w-96 p-8 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`} >
        <button
            className="absolute top-20 right-20 text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={handleShow}
            >
            <Close className="text-3xl" />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Upload New Post</h2>
        <form className="space-y-4" onSubmit={handleEditPost}>
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
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
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

export default EditPost
