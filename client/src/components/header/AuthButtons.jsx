import Button from "../ui/Button"

const AuthButtons = ({ onLoginClick }) => {
    return (
        <Button
            onClick={onLoginClick}
            type="button"
            children="ลงชื่อเข้าใช้"
            variant="secondary"
        />
    )
}
export default AuthButtons