import React from 'react'

interface Props {}

function PostForm(props: Props) {
    const {} = props

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Upload New Post</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 p-3 w-full border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter a description for your post"
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
              className="mt-1 p-3 w-full border rounded-md focus:ring focus:ring-blue-300"
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
    )
}

export default PostForm
