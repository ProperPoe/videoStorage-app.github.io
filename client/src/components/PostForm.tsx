import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';


interface Props {
  show: () => void;
}

function PostForm(props: Props) {
    const {show} = props
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
    
    const queryClient = useQueryClient();

    const [desc, setDesc] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [err, setErr] = useState("")
    
    const mutation = useMutation(
      async () => {
        const formData = new FormData();
        formData.append('desc', desc);
        if(mediaFile){
          formData.append('media', mediaFile)
        }
        return makeRequest.post("/posts", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

      },
      {
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries(["posts"])
        }
      }
    )

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setMediaFile(e.target.files[0]);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      // mutation.mutate()

      if(mediaFile === null){
        setErr("Must upload image or video")
      }else{
        show()
      }
      mutation.mutate()



    }
    return (
     <div className={`max-w-2xl mx-auto p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} rounded-lg shadow-md`}>
        <h2 className="text-2xl font-semibold mb-4">Upload New Post</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              value={desc}
              onChange={(e)=>setDesc(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-600">
              Tags
            </label>
            <input
                type="text"
                id="tags"
                name="tags"
                className={`mt-1 p-3 w-full border rounded-md focus:ring focus:ring-blue-300 ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
                }`}
                placeholder="Add tags for easy searching"
            />
          </div>
          <div>
            <label htmlFor="media" className="block text-sm font-medium text-gray-600">
              Media (Image/Video)
            </label>
            <input
              type="file"
              id="media"
              name="media"
              className="mt-1 p-3 w-full border rounded-md focus:ring focus:ring-blue-300"
              accept="image/*, video/*"
              onChange={handleMediaChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Upload Post
          </button>
        </form>
        <div className='flex justify-center'>
          <strong className='text-red-500'>

          {err}
          </strong>
        </div>
      </div>        
    )
}

export default PostForm
