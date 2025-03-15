"use client"
export default function Authpage({isSignin} : {
    isSignin : boolean
}) {
    const handleClick = () => {
        
    }
  return (
    <div className="w-full h-full flex justify-between items-center">
        <div>
            <input type="text" />
            <input type="text" />
            {!isSignin && <input type="text"/>}
            <button onClick={handleClick}>{isSignin ? "Signin" : "Signup"}</button>
        </div>
      
    </div>
  );
}