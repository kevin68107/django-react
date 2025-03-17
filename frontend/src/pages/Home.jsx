import { useState, useEffect } from 'react';
import api from "../api";
import Note from '../components/Note';
import '../styles/loader.css'

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getNotes();
  }, [])

  const getNotes = () =>{
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {setNotes(data); console.log(data)})
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api.delete(`/api/notes/delete/${id}/`).then((res) => {
      if (res.status === 204) alert("Note deleted successfully");
      else alert("Error deleting note");
      getNotes();
    })
    .catch((err) => alert(err));
  };

  const createNote = (e) => {
    e.preventDefault();
    api.post("/api/notes/", {title, content}).then((res) => {
      if (res.status === 201) alert("Note created successfully");
      else alert("Error creating note");
      getNotes();
    }).catch((err) => alert(err));
  };

  return <div className="container mx-auto p-4">
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Notes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <Note note={note} onDelete={deleteNote} key={note.id} />
        ))}
      </div>
    </div>
    <div>
      <h2 className="text-2xl font-bold mb-4">Create Note</h2>
      <form onSubmit={createNote} className="space-y-4">
        <input 
        type="text"
        id="title"
        required 
        placeholder="Title" 
        onChange={(e) => setTitle(e.target.value)} 
        value={title} 
        className="w-full p-2 border border-gray-300 rounded"
        />
        <label htmlFor="content" className="block text-lg font-medium">Content:</label>
        <textarea 
        id="content" 
        name="content" 
        required 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="Content" 
        className="w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" value="Submit" className="px-4 py-2 bg-blue-500 text-white rounded">Create</button>
      </form>
  </div>
  </div>
}

export default Home