

export default function Input({props}: any) {

    return <>
        <div className="input-group mb-3">
            <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" placeholder={props.placeholder} id="login" value={props.value} onChange={props.onchange}/>
        </div>
    </>

}