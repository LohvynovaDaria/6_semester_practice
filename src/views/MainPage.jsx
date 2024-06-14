import { useState, useEffect, Fragment, useContext } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from '../firebase/config.js';
import { useDispatch } from 'react-redux';
import {setUser} from '../store/usersSlice.js';
import { doc, onSnapshot, updateDoc, setDoc, deleteDoc, collection, serverTimestamp,
        getDocs, query, where, orderBy, limit
 } from "firebase/firestore";
import { selectUsers } from "../store/usersSlice.js";
//import { v4 as uuidv4 } from 'uuid';
import {
    AreaChart, Legend, Area, CartesianGrid, Tooltip, XAxis, YAxis
    } from "recharts";

function MainPage() {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({});
    const [databaseData, setDatabaseData] = useState("");
    const documentID = useState("data from " + auth.currentUser.uid);
    var data = "";
    const [buttonText, setButtonText] = useState("Add data");

    const collectionRef = collection(db, 'users');

    const [isSharp, setIsSharp] = useState(false);
    const Data = [
        {
          name: "2022-04-16",
          views: 17,
          visitors: 5
        },
        {
          name: "2022-04-17",
          views: 4,
          visitors: 2
        },
        {
          name: "2022-04-18",
          views: 6,
          visitors: 5
        },
        {
          name: "2022-04-19",
          views: 4,
          visitors: 2
        },
        {
          name: "2022-04-20",
          views: 5,
          visitors: 3
        }
      ];
    
    const unsub = onSnapshot(doc(db, "users", documentID.toString()), (doc) => {
        if (doc.exists()) {
            data += "domain name - ";
            data += doc.data().domainName;
            data += ", product feed - ";
            data += doc.data().productFeed;
            setDatabaseData(data);
            console.log(databaseData);
            setButtonText("Change data");
        }
    });

    //useEffect(() => {
      //      console.log("We are here");
        //    const q = query(collectionRef/*, where("userId", "==", auth.currentUser.uid)*/);

            //const querySnapshot = async() => await getDocs(q);
          //  (async () => {
            //const querySnapshot = /*async() => await*/ collectionRef.where("userId", "==", auth.currentUser.uid).get();
            //console.log(querySnapshot);

            //data = querySnapshot;
            //})();

            /*let inputDomainName = document.getElementById("inputDomainName");
            let inputProductFeed = document.getElementById("inputProductFeed");
            inputDomainName.innerText(querySnapshot[0].get("domainName"));*/
            //data = "Current data: ";
          
            //data = querySnapshot.docs/*.map(doc => doc.data())*/;
            /*querySnapshot.forEach((doc) => {
                data += doc.data();
            });*/

            //console.log(data);

            //let currentData = document.getElementById("currentData");
            
            //currentData.innerHTML(data);
       // })

    function handleSignOut() {
        if(window.confirm('Are you sure you want to log out?')) {
            signOut(auth).then(() => {
                dispatch(setUser(null));
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    function handleUserData(e) {
        setUserData({...userData, [e.target.name]: e.target.value});
    }

    const handleAdmitData = async() => {
        console.log(documentID);
        try {
            //const docRef = doc(db, "users"/*, auth.currentUser.uid*/);
            
            const userRef = doc(collectionRef, documentID.toString());
            await setDoc(userRef, {
                //userId: auth.currentUser.uid,
                domainName: userData.domainName,
                productFeed: userData.productFeed,
            })
            /*const docRef = await addDoc(collection(db, "users"), {
              first: "Ada",
              last: "Lovelace",
              born: 1815
            });*/
            //console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    return (
        <div className="container">
            <div className="header-btns">

                <button onClick={handleSignOut} className="btn transparent">
                Logout
                </button>

            </div>
            
            <p>Current data: {databaseData}</p>
            
            <div className="form-control">
                <label>Domain name</label>
                <input id="inputDomainName" onChange={(e)=>handleUserData(e)} type="text" name="domainName" placeholder="Enter your domain namel" />
            </div>
            <div className="form-control">
                <label>Product feed</label>
                <input id="inputProductFeed" onChange={(e)=>handleUserData(e)} type="text" name="productFeed" placeholder="Enter link to your product feed" />
            </div>
            <button onClick={handleAdmitData} className='active btn' >{buttonText}</button>

            <div id="area-chart">
                <h2>Views</h2>
                <AreaChart
                    width={700}
                    height={400}
                    data={Data}
                    onMouseOver={() => setIsSharp(!isSharp)}
                    onMouseOut={() => setIsSharp(!isSharp)}
                >
                    <Tooltip />
                    <Area
                    type={isSharp ? "" : "monotone"}
                    dataKey="views"
                    stroke="#bb86fc"
                    fill="#bb86fc"
                    />
                    <Area
                    type={isSharp ? "" : "monotone"}
                    dataKey="visitors"
                    stroke="#fa6c90"
                    fill="#ff7598bf"
                    />
                    <CartesianGrid stroke="#666" strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#000" />
                    <Legend />
                    <YAxis stroke="#000" />
                </AreaChart>
            </div>
        </div>
    )
}

export default MainPage