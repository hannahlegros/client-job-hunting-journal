import React, { useState, useEffect } from 'react';
import Task from './Task';
import apiUrl from '../apiConfig'

function Profile(props) {    

    /**************************************
	 * DEFINE NEW PROFILE AND EDIT STATES *
	 **************************************/	

    const [newProfile, setNewProfile] = useState({
        name: '',
        skills: [],
        zipCode: '',
        interviewQuestions: {},
        owner: props.user._id
    })
    const [edit, setEdit] = useState(false)

    /*********************
	 * HELPER FUNCTIONS  *
	 *********************/	

    // Set edit state to true on click
    const editProfile = (e) => {
        setEdit(true) 
        setNewProfile({
            name: props.currentProfile.name,
            skills: props.currentProfile.skills.join(', '),
            zipCode: props.currentProfile.zipCode,
            interviewQuestions: {},
            owner: props.user._id
        })                      
    }
    // Set values in new profile state to entries
    const handleChange = (e) => {
        setNewProfile({...newProfile, [e.target.name]: e.target.value}) 
    }

    /*********************************
	 * FUNCTION TO SET EDIT PROFILE  *
	 *********************************/	

    const handleEdit = (e) => {
        e.preventDefault()       
        // Send data to the API in this object form
        let preJSONBody = {                         
            name: newProfile.name,
            skills: newProfile.skills.split(',').map(skill => skill.trim()),
            zipCode: newProfile.zipCode,
            interviewQuestions: newProfile.interviewQuestions,
            owner: newProfile.owner      
        }
        // Fetch request to update profile
        fetch(apiUrl + `/profiles/${props.currentProfile._id}`, {       
            method: 'PATCH',
            body: JSON.stringify(preJSONBody),
            headers: { 'Content-Type': 'application/JSON', 'Authorization': 'Bearer ' + props.user.token }
        })
        .then(() => {
            // console.log('is this hitting?')
            // Reset profile state to empty state
            setNewProfile({             
                name: '',
                skills: [],
                zipCode: '',
                interviewQuestions: {},
                owner: props.user._id
            })
            setEdit(false)             
            props.getProfile()        
        })
        .catch(error => { console.log(error) })
    }

    /*************************************
	 * FUNCTION TO CREATE FIRST PROFILE  *
	 *************************************/	

    const handleSubmit = (e) => {       
        e.preventDefault()
        let preJSONBody = {
            name: newProfile.name,
            skills: newProfile.skills.split(',').map(skill => skill.trim()),
            zipCode: newProfile.zipCode,
            interviewQuestions: newProfile.interviewQuestions,
            owner: newProfile.owner
        }
        fetch(apiUrl + '/profiles', {
            method: 'POST',
            body: JSON.stringify(preJSONBody),
            headers: { 'Content-Type': 'application/JSON'}
        })
        .then(response => response.json())
        .then(() => {
            setNewProfile({
                name: '',
                skills: [],
                zipCode: '',
                interviewQuestions: {},
                owner: props.user._id
            })
            props.getProfile()
        })
        .catch(error => { console.log(error) })
    }

    /***********************
	 * PROFILE INFO FORMS  *
	 ***********************/	

    let display 
    // If check to see if a profile exists
    // If doesn't exist, show form upon first login
    if (props.currentProfile === undefined) {
        display = (
            <form id='new-profile-form-container' onSubmit={handleSubmit} >
                <div>
                    <label htmlFor='name'>Name</label>
                    <input onChange={handleChange} type='text' name='name' id='name' value={newProfile.name} />
                </div>
                <div>
                    <label htmlFor='skills'>Skills</label>
                    <input onChange={handleChange} type='text' name='skills' id='skills' value={newProfile.skills} />
                </div>
                <div>
                    <label htmlFor='zipCode'>Zip Code</label>
                    <input onChange={handleChange} type='text' name='zipCode' id='zipCode' value={newProfile.zipCode} />
                </div>
                <input type='submit' value='submit' />
            </form>
        )
    } 
        // If profile exists, check if edit state is false
        else {     
        // If edit state false, show profile info otherwise show form            
        if (edit === false){    
            const skillList = props.currentProfile.skills.map(skill => {
                return (<li>{skill}</li>)
            })
            display = (
                <div id='profile-container'>
                    <h1>{props.currentProfile.name}'s Profile</h1>
                    <h3>Skills:</h3>
                    <ul id='skill-ul'>
                        {skillList}
                    </ul>
                    <h4>Zip Code: {props.currentProfile.zipCode}</h4>
                    <h3>{props.currentProfile.interviewQuestions}</h3>
                    <button onClick={editProfile}>Edit Profile</button>
                </div>
            )
        } else {                    
            display = (
                <form id='edit-form-container' onSubmit={handleEdit}>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input onChange={handleChange} type='text' name='name' id='name' value={newProfile.name}required/>
                    </div>
                    <div>
                        <label htmlFor='skills'>Skills</label>
                        <input onChange={handleChange} type='text' name='skills' id='skills' value={newProfile.skills} />
                    </div>
                    <div>
                        <label htmlFor='zipCode'>Zip Code</label>
                        <input onChange={handleChange} type='text' minLength='5' maxLength='5' name='zipCode' id='zipCode' value={newProfile.zipCode} />
                    </div>
                    <input type='submit' value='submit' />
                </form>)
        }
    }
    return (
        <div>
            {display}
        </div>
    )
}
export default Profile