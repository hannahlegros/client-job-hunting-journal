import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import apiUrl from '../apiConfig'

function JobCard (props) {

    const markApplied = () => {
        let preJSONBody = {
            applied: true
        }
        fetch(apiUrl + `/jobs/${props.job._id}`, {
            method: 'PATCH',
            body: JSON.stringify(preJSONBody),
            headers: { 'Content-Type': 'application/JSON', 'Authorization': 'Bearer ' + props.user.token }
        })
        .then(() => props.getJobs())
        .catch(error => console.log(error))
    }
    
    const deleteJob = () => {
        deleteTask()
        fetch(apiUrl + `/jobs/${props.job._id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/JSON', 'Authorization': 'Bearer ' + props.user.token }
        })
        .then(() => props.getJobs())
        .catch(error => console.log(error))
    }

    const deleteTask = () => {
        fetch(apiUrl + `/tasks/delete-all/${props.job._id}`, { // I'm in hell
            method: 'DELETE',
            headers: { 'Content-Type': 'application/JSON', 'Authorization': 'Bearer ' + props.user.token }
        })
            .catch(error => console.log(error))
    }

    //map function to display all the job cards
    return (
        <div className={`job-card-container ${props.job.applied ? 'applied-true' : 'applied-false'} `}>
            <h1> <Link to={`/job/${props.job._id}`}> {props.job.jobTitle} - {props.job.company}</Link></h1>
            <p>{props.job.applied ? 'Applied!' : <button onClick={markApplied}>Mark as Applied</button>}</p>
            <button onClick={deleteJob}>Delete</button>
        </div>
    )
}
export default JobCard