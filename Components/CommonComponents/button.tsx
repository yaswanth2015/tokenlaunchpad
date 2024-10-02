import "./button.css"


export default function Button({props} :any) {

    return <div className="d-grid gap-2">
    <button
        type="button"
        name=""
        className="btn btn-primary"
        onClick={props.onclick}
        id="custombutton"
    >
        {props.buttonname}
    </button>
</div>
}