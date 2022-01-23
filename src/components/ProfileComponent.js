import React, { Component } from 'react';
// class Profile extends Component{

//     render(){
//         return (
//             <div>
//                 <p>Profile</p>
//                 <div className='profile-header'>

//                 </div>
//                 <div className='big-profile-picture'>

//                 </div>
//                 <div className='profile-name'>
//                     saba
//                 </div>
//                 <div className='delete-button'>
//                     Delete
//                 </div>
//             </div>

//         );
//     }
// }
// export default Profile;

class Profile extends Component{
    render(){
        return (
            <div className="d-flex  profile justify-content-center">
                <div className='profile-header'>
                </div>
                <div className='big-profile-picture'>

                </div>
                <div className='profile-name'>
                    saba 
                </div>
                <div className='delete-button'>
                    Delete
                </div>
            </div>

        );
    }
}
export default Profile;