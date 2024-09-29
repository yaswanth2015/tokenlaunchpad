


export default function UserName({props}: any) {

    return (
        <div className="input-group mb-3">
            {/* <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-default">email</span>
            </div> */}
            <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" placeholder="Enter Email Id" id="login" value={props.email} onChange={(e)=>{
                const value = e.target.value
                props.setEmail(value)
            }}/>
        </div>
    )
}