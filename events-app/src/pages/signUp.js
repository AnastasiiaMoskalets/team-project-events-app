import React , {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function SignUp(){
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.prevebtDefault();
        if (email === 'user@example.com' && password === '12345') {
            // Redirect to the user dashboard
            navigate('/userprofile');
            console.log("redirected to user dashboard")
          } else {
            setError('Invalid credentials. Please try again.');
          }
    };
    

    return(
     <p>
      Hello from signUp
     </p>
    )

}
export default SignUp