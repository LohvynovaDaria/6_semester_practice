import {useState} from 'react';
import {auth} from '../firebase/config.js'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { useDispatch } from 'react-redux';
import {setUser} from '../store/usersSlice.js';
import ForgotPasswordDialog from './ForgotPasswordDialog';


function LoginPage() {
    const dispatch = useDispatch();
    //const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState('login');
    const [userCredentials, setUserCredentials] = useState({});
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const provider = new GoogleAuthProvider();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({id: user.uid, email: user.email}));
      } else {
        dispatch(setUser(null));
      }
    });

    function handleCredentials(e) {
      setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
    }

    function handleSignup(e) {
      e.preventDefault();
      setError("");
      createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
      .then((userCredential) => {
        console.log(userCredential.user);
        dispatch(setUser({id: userCredential.user.uid, email: userCredential.user.email}));
      })
      .catch((error) => {
        setError(error.message);
      });
    }

    function handleLogin(e) {
      e.preventDefault();
      setError("");

      signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
      .then((userCredential) => {
        console.log(userCredential.user);
        dispatch(setUser({id: userCredential.user.uid, email: userCredential.user.email}));
      })
      .catch((error) => {
        setError(error.message);
      });
    }

    function handlePasswordReset() {
      const email = prompt('Please enter your email');
      sendPasswordResetEmail(auth, email);
      alert('Email sent! Check your inbox for password reset instructions.')
    }

    function handleLoginWithGoogle() {
      signInWithRedirect(auth, provider);
      getRedirectResult(auth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
      /*signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        //setUserCredentials(...userCredentials, user.email);
        dispatch(setUser({id: user.uid, email: user.email}));
      }).catch((error) => {
        // Handle Errors here.
        console.log(error.code);
        console.log(error.message);
        // The email of the user's account used.
        console.log(error.customData.email);
        // The AuthCredential type that was used.
        console.log(GoogleAuthProvider.credentialFromError(error));
        // ...
      });*/
    }
  
    //{ isLoading && <FullPageLoader></FullPageLoader> }
      return (
        <>
          
          
          <div className="container login-page">
            <section>
              <h1>Welcome to the Admin Panel</h1>
              <p>Login or create an account to continue</p>
              <div className="login-type">
                <button 
                  className={`btn ${loginType == 'login' ? 'selected' : ''}`}
                  onClick={()=>setLoginType('login')}>
                    Login
                </button>
                <button 
                  className={`btn ${loginType == 'signup' ? 'selected' : ''}`}
                  onClick={()=>setLoginType('signup')}>
                    Signup
                </button>
              </div>
              <form className="add-form login">
                    <div className="form-control">
                        <label>Email *</label>
                        <input onChange={(e)=>handleCredentials(e)} type="text" name="email" placeholder="Enter your email" />
                    </div>
                    <div className="form-control">
                        <label>Password *</label>
                        <input onChange={(e)=>handleCredentials(e)} type="password" name="password" placeholder="Enter your password" />
                    </div>
                    {
                      loginType == 'login' ?
                      <button onClick={(e)=>{handleLogin(e)}} className="active btn btn-block">Login</button>
                      : 
                      <button onClick={(e)=>{handleSignup(e)}} className="active btn btn-block">Sign Up</button>
                    }

                    <button onClick={handleLoginWithGoogle} className='active btn btn-block' >Login with Google</button>

                    {
                      error && 
                      <div className="error">
                        {error}
                      </div>
                    }
  
                    <p onClick={handlePasswordReset} className="forgot-password">Forgot Password?</p>
                    <p onClick={() => setIsDialogOpen(true)} className="forgot-password">Forgot password?</p>
                    <ForgotPasswordDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
                    
                </form>
            </section>
          </div>
        </>
      )
    }
    
    export default LoginPage