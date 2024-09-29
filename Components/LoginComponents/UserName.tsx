import Input from "../CommonComponents/Input"



export default function UserName({props}: any) {

    function onchange(e: any) {
        const value = e.target.value
        props.setEmail(value)
    }
    const value = props.email
    return (
        <Input props={{ value, onchange, placeholder: "Enter Email id"}}/>
    )
}