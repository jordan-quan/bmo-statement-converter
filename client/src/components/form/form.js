import React, { useState } from 'react';
import './form.css';
import Loader from '../loader/loader.js';
import axios from 'axios';
import { motion } from 'framer-motion'

const containerVariant = {
  hidden: {
    opacity: 0
  },

  visible: {
    opacity: 1,
    transition: { duration: 1 }
  }
}

const Feedback = ({ message }) => (
  <motion.div
    variants={containerVariant}
    initial="hidden"
    animate="visible"
  >{message}</motion.div>
)


const Form = () => {

  var [title, setTitle] = useState("");
  var [files, setFiles] = useState({});
  var [showLoader, setLoader] = useState(false);
  var [showForm, setForm] = useState(true);
  var [showFeedback, setFeedback] = useState(false);
  var [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    var formData = new FormData();
    formData.append('title', title);
    for (const key of Object.keys(files)) {
      formData.append('files', files[key])
    }

    setLoader(true);
    setForm(false);
    setTimeout(() => {
      axios.post("http://localhost:8000/pdf/pdftoexcel", formData, {
      }).then(res => {
        setFeedbackMessage(res.data)
      }).catch(e => {
        setFeedbackMessage(e);
      }).finally(() => {
        setLoader(false);
        setFeedback(true);
      })

    }, 2000);
  }


  return (
    <div className="form">

      {showForm && <form onSubmit={handleSubmit}>

        <input id="file" type="file" name="files" files={files}
          onChange={e => setFiles(e.target.files)} accept=".pdf" multiple required />


        <input className="textbox" type="text" name="title" value={title}
          onChange={e => setTitle(e.target.value)} placeholder="Name your file" required />

        <input id="submit" className="button" type="submit" value="Submit" />

      </form>}

      {showLoader && <Loader />}
      {showFeedback && <Feedback message={feedbackMessage} />}

    </div>

  );
}



export default Form;
